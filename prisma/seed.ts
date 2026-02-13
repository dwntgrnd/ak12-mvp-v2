import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as readline from 'readline';

const prisma = new PrismaClient();
const BATCH_SIZE = 500;
const SQL_FILE = '/Users/dorenberge/WorkInProgress/AK12_dev/alchemyk12_complete_data.sql';

const TARGET_TABLES = new Set(['master_district', 'district_info', 'school']);

// ============================================================
// SQL Value Parser — handles strings with escaped quotes,
// commas inside strings, NULL literals, and numbers.
// ============================================================

function parseValues(s: string): (string | null)[] {
  const values: (string | null)[] = [];
  let i = 0;

  while (i < s.length) {
    while (i < s.length && (s[i] === ' ' || s[i] === ',')) i++;
    if (i >= s.length || s[i] === ')') break;

    if (s[i] === "'") {
      i++; // skip opening quote
      let str = '';
      while (i < s.length) {
        if (s[i] === "'") {
          if (i + 1 < s.length && s[i + 1] === "'") {
            str += "'";
            i += 2;
          } else {
            i++; // skip closing quote
            break;
          }
        } else {
          str += s[i];
          i++;
        }
      }
      values.push(str);
    } else if (s.slice(i, i + 4).toUpperCase() === 'NULL') {
      values.push(null);
      i += 4;
    } else {
      let val = '';
      while (i < s.length && s[i] !== ',' && s[i] !== ')') {
        val += s[i];
        i++;
      }
      values.push(val.trim());
    }
  }

  return values;
}

function parseSqlInsert(line: string): { table: string; columns: string[]; values: (string | null)[] } | null {
  const match = line.match(/^INSERT INTO public\.(\w+)\s*\(/);
  if (!match) return null;

  const table = match[1];
  if (!TARGET_TABLES.has(table)) return null;

  const firstParen = line.indexOf('(');
  const closeParen = line.indexOf(')', firstParen);
  if (closeParen === -1) return null;

  const columnsStr = line.substring(firstParen + 1, closeParen);
  const columns = columnsStr.split(',').map(c => c.trim().replace(/"/g, ''));

  const valuesIdx = line.indexOf('VALUES (', closeParen);
  if (valuesIdx === -1) return null;

  const valuesStr = line.substring(valuesIdx + 8); // after "VALUES ("
  const values = parseValues(valuesStr);

  if (columns.length !== values.length) {
    console.warn(`Column/value mismatch for ${table}: ${columns.length} cols, ${values.length} vals`);
    return null;
  }

  return { table, columns, values };
}

// ============================================================
// Transform Helpers
// ============================================================

function cleanStr(val: string | null | undefined): string | null {
  if (val === null || val === undefined || val === '' || val === 'No Data') return null;
  return val.trim();
}

function reqStr(val: string | null | undefined, fallback = ''): string {
  if (val === null || val === undefined || val === 'No Data') return fallback;
  return val.trim() || fallback;
}

function toFloat(val: string | null | undefined): number | null {
  if (val === null || val === undefined || val === '' || val === 'No Data') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function toInt(val: string | null | undefined): number | null {
  if (val === null || val === undefined || val === '' || val === 'No Data') return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function toDate(val: string | null | undefined): Date {
  if (val === null || val === undefined || val === '' || val === 'No Data') return new Date();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

// ============================================================
// Row Transformers
// ============================================================

function toMap(columns: string[], values: (string | null)[]): Record<string, string | null> {
  const map: Record<string, string | null> = {};
  for (let i = 0; i < columns.length; i++) {
    map[columns[i]] = values[i];
  }
  return map;
}

function transformMasterDistrict(columns: string[], values: (string | null)[]): Record<string, unknown> | null {
  const m = toMap(columns, values);

  if (!m.id || !m.cdsCode || !m.name) return null;

  return {
    id: m.id,
    name: reqStr(m.name),
    cdsCode: reqStr(m.cdsCode),
    code: cleanStr(m.code),
    street: cleanStr(m.street),
    city: cleanStr(m.city),
    state: cleanStr(m.state),
    zip: cleanStr(m.zip),
    county: cleanStr(m.county),
    phone: cleanStr(m.phone),
    website: cleanStr(m.website),
    docType: cleanStr(m.docType),
    superintendentFirstName: cleanStr(m.adminFirstName),
    superintendentLastName: cleanStr(m.adminLastName),
    latitude: toFloat(m.lattitute),
    longitude: toFloat(m.longitude),
    ncesDistrictId: cleanStr(m.ncesDistrict),
    statusType: cleanStr(m.statusType),
    createdAt: toDate(m.createdAt),
    updatedAt: toDate(m.updatedAt),
  };
}

function transformDistrictInfo(columns: string[], values: (string | null)[]): Record<string, unknown> | null {
  const m = toMap(columns, values);

  if (!m.id || !m.masterDistrictId) return null;

  return {
    id: m.id,
    masterDistrictId: m.masterDistrictId,
    academicYear: reqStr(m.academicYear),
    status: cleanStr(m.status),
    gradeServed: cleanStr(m.gradeServed),
    lowGrade: cleanStr(m.lowGrade),
    highGrade: cleanStr(m.highGrade),
    numberOfSchools: toInt(m.noOfSchools),
    totalEnrollment: toInt(m.totalEnrollment),
    studentSpending: toFloat(m.studentSpending),
    ellPercentage: toFloat(m.ell),
    totalEll: toInt(m.totalEl),
    frpmCount: toInt(m.frpmCount),
    frpmEnrollment: toInt(m.frpmEnrollment),
    spedCount: toInt(m.sped),
    chronicAbsenteeismRate: toFloat(m.chronicAbsenteeismRate),
    elaProficiency: toFloat(m.elaProficiency),
    mathProficiency: toFloat(m.mathProficiency),
    createdAt: toDate(m.createdAt),
    updatedAt: toDate(m.updatedAt),
  };
}

function transformSchool(columns: string[], values: (string | null)[]): Record<string, unknown> | null {
  const m = toMap(columns, values);

  if (!m.id || !m.cdsCode || !m.name) return null;

  return {
    id: m.id,
    name: reqStr(m.name),
    cdsCode: reqStr(m.cdsCode),
    masterDistrictId: cleanStr(m.masterDistrictId),
    academicYear: cleanStr(m.academicYear),
    district: cleanStr(m.district),
    gradesOffered: cleanStr(m.gsOffered),
    gradesServed: cleanStr(m.gsServed),
    charter: cleanStr(m.charter),
    virtual: cleanStr(m.virtual),
    magnet: cleanStr(m.magnet),
    street: cleanStr(m.street),
    city: cleanStr(m.city),
    state: cleanStr(m.state),
    zip: cleanStr(m.zip),
    phone: cleanStr(m.phone),
    website: cleanStr(m.website),
    principalFirstName: cleanStr(m.adminFirstName),
    principalLastName: cleanStr(m.adminLastName),
    latitude: toFloat(m.lattitute),
    longitude: toFloat(m.longitude),
    statusType: cleanStr(m.statusType),
    createdAt: toDate(m.createdAt),
    updatedAt: toDate(m.updatedAt),
  };
}

// ============================================================
// Controlled Vocabulary
// ============================================================

const SUBJECT_AREAS = [
  'English Language Arts',
  'Mathematics',
  'Science',
  'Social Studies',
  'World Languages',
  'Arts & Music',
  'Physical Education & Health',
  'Computer Science & Technology',
  'Career & Technical Education',
  'Social-Emotional Learning',
  'Special Education',
  'English Language Development',
  'Other',
];

async function seedControlledVocabulary() {
  for (let i = 0; i < SUBJECT_AREAS.length; i++) {
    await prisma.controlledVocabulary.upsert({
      where: {
        vocabularyName_value: {
          vocabularyName: 'subjectArea',
          value: SUBJECT_AREAS[i],
        },
      },
      update: { sortOrder: i, isActive: true },
      create: {
        vocabularyName: 'subjectArea',
        value: SUBJECT_AREAS[i],
        sortOrder: i,
        isActive: true,
      },
    });
  }
}

// ============================================================
// Batch Inserter
// ============================================================

async function batchInsert(
  label: string,
  data: Record<string, unknown>[],
  insertFn: (batch: Record<string, unknown>[]) => Promise<{ count: number }>,
) {
  let inserted = 0;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    const result = await insertFn(batch);
    inserted += result.count;
  }
  console.log(`  ${label}: ${inserted} inserted (${data.length} parsed)`);
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('=== AlchemyK12 Seed Script ===');
  console.log(`SQL file: ${SQL_FILE}`);

  if (!fs.existsSync(SQL_FILE)) {
    throw new Error(`SQL file not found: ${SQL_FILE}`);
  }

  // Phase 1: Parse SQL dump (stream line-by-line)
  console.log('\n[1/5] Parsing SQL dump...');
  const masterDistricts: Record<string, unknown>[] = [];
  const districtInfos: Record<string, unknown>[] = [];
  const schools: Record<string, unknown>[] = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(SQL_FILE, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.startsWith('INSERT INTO public.')) continue;

    const parsed = parseSqlInsert(line);
    if (!parsed) continue;

    const { table, columns, values } = parsed;

    if (table === 'master_district') {
      const row = transformMasterDistrict(columns, values);
      if (row) masterDistricts.push(row);
    } else if (table === 'district_info') {
      const row = transformDistrictInfo(columns, values);
      if (row) districtInfos.push(row);
    } else if (table === 'school') {
      const row = transformSchool(columns, values);
      if (row) schools.push(row);
    }
  }

  console.log(`  Parsed: ${masterDistricts.length} districts, ${districtInfos.length} info, ${schools.length} schools`);

  // FK validation: collect master district IDs
  const validIds = new Set(masterDistricts.map(d => d.id as string));

  // Filter district_info with invalid FK (masterDistrictId is required)
  const validInfos = districtInfos.filter(d => validIds.has(d.masterDistrictId as string));
  if (validInfos.length < districtInfos.length) {
    console.log(`  Filtered ${districtInfos.length - validInfos.length} district_info rows (missing FK)`);
  }

  // Nullify invalid school FKs (masterDistrictId is optional)
  let nullifiedSchoolFks = 0;
  for (const s of schools) {
    if (s.masterDistrictId && !validIds.has(s.masterDistrictId as string)) {
      s.masterDistrictId = null;
      nullifiedSchoolFks++;
    }
  }
  if (nullifiedSchoolFks > 0) {
    console.log(`  Nullified ${nullifiedSchoolFks} school FK references`);
  }

  // Phase 2: Insert master districts
  console.log('\n[2/5] Inserting master districts...');
  await batchInsert('master_district', masterDistricts, (batch) =>
    prisma.masterDistrict.createMany({ data: batch as any, skipDuplicates: true })
  );

  // Phase 3: Insert district info
  console.log('\n[3/5] Inserting district info...');
  await batchInsert('district_info', validInfos, (batch) =>
    prisma.districtInfo.createMany({ data: batch as any, skipDuplicates: true })
  );

  // Phase 4: Insert schools
  console.log('\n[4/5] Inserting schools...');
  await batchInsert('school', schools, (batch) =>
    prisma.school.createMany({ data: batch as any, skipDuplicates: true })
  );

  // Phase 5: Seed controlled vocabulary
  console.log('\n[5/5] Seeding controlled vocabulary...');
  await seedControlledVocabulary();
  console.log('  controlled_vocabulary: 13 subject areas');

  // Summary
  console.log('\n=== Seed Complete ===');
  const counts = {
    masterDistrict: await prisma.masterDistrict.count(),
    districtInfo: await prisma.districtInfo.count(),
    school: await prisma.school.count(),
    controlledVocabulary: await prisma.controlledVocabulary.count(),
  };
  console.log(`  master_district: ${counts.masterDistrict}`);
  console.log(`  district_info: ${counts.districtInfo}`);
  console.log(`  school: ${counts.school}`);
  console.log(`  controlled_vocabulary: ${counts.controlledVocabulary}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
