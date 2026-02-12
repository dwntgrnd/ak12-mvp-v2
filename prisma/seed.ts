import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed default tenant
  const tenant = await prisma.tenant.upsert({
    where: { organizationName: 'EduVision Publishing' },
    update: {},
    create: {
      organizationName: 'EduVision Publishing',
      status: 'active',
    },
  });
  console.log('Seeded tenant:', tenant.organizationName);

  // Seed default admin user
  await prisma.user.upsert({
    where: { email: 'admin@eduvision.com' },
    update: {},
    create: {
      clerkId: 'dev_placeholder',
      tenantId: tenant.id,
      email: 'admin@eduvision.com',
      displayName: 'Sarah Chen',
      role: 'publisher-admin',
      status: 'active',
      invitedAt: new Date(),
    },
  });
  console.log('Seeded admin user: admin@eduvision.com');

  // California school district seed data
  const districts = [
    {
      name: 'Los Angeles Unified School District',
      location: 'Los Angeles, CA',
      county: 'Los Angeles',
      enrollment: 422276,
      demographics: {
        'Hispanic/Latino': 73.4,
        'White': 10.3,
        'African American': 7.7,
        'Asian': 3.9,
        'Filipino': 2.1,
        'Two or More Races': 1.8,
        'Other': 0.8,
      },
      proficiency: {
        'Math': 33.2,
        'ELA': 40.1,
        'Science': 25.8,
      },
      funding: {
        'Per Pupil Spending': 16890,
        'Total Budget': 7130000000,
        'Title I': 458000000,
        'LCFF Supplemental': 1200000000,
      },
    },
    {
      name: 'San Diego Unified School District',
      location: 'San Diego, CA',
      county: 'San Diego',
      enrollment: 98000,
      demographics: {
        'Hispanic/Latino': 47.5,
        'White': 23.1,
        'Asian': 16.2,
        'African American': 8.3,
        'Filipino': 3.1,
        'Two or More Races': 1.8,
      },
      proficiency: {
        'Math': 42.8,
        'ELA': 49.3,
        'Science': 35.6,
      },
      funding: {
        'Per Pupil Spending': 14250,
        'Total Budget': 1396500000,
        'Title I': 87000000,
        'LCFF Supplemental': 245000000,
      },
    },
    {
      name: 'Long Beach Unified School District',
      location: 'Long Beach, CA',
      county: 'Los Angeles',
      enrollment: 70000,
      demographics: {
        'Hispanic/Latino': 58.2,
        'White': 12.4,
        'Asian': 13.6,
        'African American': 11.8,
        'Pacific Islander': 2.3,
        'Two or More Races': 1.7,
      },
      proficiency: {
        'Math': 38.5,
        'ELA': 44.2,
        'Science': 31.7,
      },
      funding: {
        'Per Pupil Spending': 13800,
        'Total Budget': 966000000,
        'Title I': 68000000,
        'LCFF Supplemental': 185000000,
      },
    },
    {
      name: 'Fresno Unified School District',
      location: 'Fresno, CA',
      county: 'Fresno',
      enrollment: 72000,
      demographics: {
        'Hispanic/Latino': 71.8,
        'White': 11.2,
        'Asian': 8.9,
        'African American': 6.4,
        'Two or More Races': 1.7,
      },
      proficiency: {
        'Math': 28.4,
        'ELA': 35.9,
        'Science': 22.3,
      },
      funding: {
        'Per Pupil Spending': 12900,
        'Total Budget': 928800000,
        'Title I': 112000000,
        'LCFF Supplemental': 265000000,
      },
    },
    {
      name: 'Santa Ana Unified School District',
      location: 'Santa Ana, CA',
      county: 'Orange',
      enrollment: 44000,
      demographics: {
        'Hispanic/Latino': 94.3,
        'White': 2.1,
        'Asian': 1.8,
        'African American': 0.9,
        'Two or More Races': 0.9,
      },
      proficiency: {
        'Math': 25.7,
        'ELA': 32.4,
        'Science': 19.8,
      },
      funding: {
        'Per Pupil Spending': 13200,
        'Total Budget': 580800000,
        'Title I': 78000000,
        'LCFF Supplemental': 198000000,
      },
    },
    {
      name: 'San Francisco Unified School District',
      location: 'San Francisco, CA',
      county: 'San Francisco',
      enrollment: 49000,
      demographics: {
        'Hispanic/Latino': 33.2,
        'Asian': 28.5,
        'White': 15.3,
        'African American': 7.8,
        'Filipino': 4.2,
        'Two or More Races': 11.0,
      },
      proficiency: {
        'Math': 48.6,
        'ELA': 53.2,
        'Science': 42.1,
      },
      funding: {
        'Per Pupil Spending': 18500,
        'Total Budget': 906500000,
        'Title I': 52000000,
        'LCFF Supplemental': 145000000,
      },
    },
    {
      name: 'Sacramento City Unified School District',
      location: 'Sacramento, CA',
      county: 'Sacramento',
      enrollment: 40000,
      demographics: {
        'Hispanic/Latino': 48.5,
        'White': 18.3,
        'Asian': 15.7,
        'African American': 12.8,
        'Two or More Races': 4.7,
      },
      proficiency: {
        'Math': 34.2,
        'ELA': 41.6,
        'Science': 28.9,
      },
      funding: {
        'Per Pupil Spending': 14100,
        'Total Budget': 564000000,
        'Title I': 68000000,
        'LCFF Supplemental': 158000000,
      },
    },
    {
      name: 'Oakland Unified School District',
      location: 'Oakland, CA',
      county: 'Alameda',
      enrollment: 34000,
      demographics: {
        'Hispanic/Latino': 42.1,
        'African American': 21.5,
        'Asian': 13.8,
        'White': 11.2,
        'Filipino': 3.4,
        'Two or More Races': 8.0,
      },
      proficiency: {
        'Math': 31.8,
        'ELA': 38.5,
        'Science': 26.4,
      },
      funding: {
        'Per Pupil Spending': 15800,
        'Total Budget': 537200000,
        'Title I': 72000000,
        'LCFF Supplemental': 165000000,
      },
    },
    {
      name: 'San Bernardino City Unified School District',
      location: 'San Bernardino, CA',
      county: 'San Bernardino',
      enrollment: 47000,
      demographics: {
        'Hispanic/Latino': 85.7,
        'White': 5.8,
        'African American': 6.2,
        'Asian': 1.3,
        'Two or More Races': 1.0,
      },
      proficiency: {
        'Math': 22.8,
        'ELA': 30.4,
        'Science': 18.2,
      },
      funding: {
        'Per Pupil Spending': 12600,
        'Total Budget': 592200000,
        'Title I': 98000000,
        'LCFF Supplemental': 235000000,
      },
    },
    {
      name: 'Stockton Unified School District',
      location: 'Stockton, CA',
      county: 'San Joaquin',
      enrollment: 37000,
      demographics: {
        'Hispanic/Latino': 67.4,
        'Asian': 13.5,
        'White': 8.2,
        'African American': 7.8,
        'Pacific Islander': 2.1,
        'Two or More Races': 1.0,
      },
      proficiency: {
        'Math': 26.9,
        'ELA': 34.2,
        'Science': 21.5,
      },
      funding: {
        'Per Pupil Spending': 12800,
        'Total Budget': 473600000,
        'Title I': 85000000,
        'LCFF Supplemental': 195000000,
      },
    },
    {
      name: 'Elk Grove Unified School District',
      location: 'Elk Grove, CA',
      county: 'Sacramento',
      enrollment: 63000,
      demographics: {
        'Hispanic/Latino': 32.5,
        'Asian': 27.8,
        'White': 20.4,
        'African American': 11.3,
        'Filipino': 4.2,
        'Two or More Races': 3.8,
      },
      proficiency: {
        'Math': 41.7,
        'ELA': 47.2,
        'Science': 36.8,
      },
      funding: {
        'Per Pupil Spending': 13500,
        'Total Budget': 850500000,
        'Title I': 56000000,
        'LCFF Supplemental': 142000000,
      },
    },
    {
      name: 'San Jose Unified School District',
      location: 'San Jose, CA',
      county: 'Santa Clara',
      enrollment: 30000,
      demographics: {
        'Hispanic/Latino': 51.2,
        'Asian': 21.5,
        'White': 14.3,
        'African American': 3.8,
        'Filipino': 6.2,
        'Two or More Races': 3.0,
      },
      proficiency: {
        'Math': 39.8,
        'ELA': 45.6,
        'Science': 33.2,
      },
      funding: {
        'Per Pupil Spending': 15200,
        'Total Budget': 456000000,
        'Title I': 42000000,
        'LCFF Supplemental': 98000000,
      },
    },
    {
      name: 'Riverside Unified School District',
      location: 'Riverside, CA',
      county: 'Riverside',
      enrollment: 41000,
      demographics: {
        'Hispanic/Latino': 70.8,
        'White': 13.2,
        'African American': 8.5,
        'Asian': 4.7,
        'Two or More Races': 2.8,
      },
      proficiency: {
        'Math': 32.5,
        'ELA': 39.8,
        'Science': 26.7,
      },
      funding: {
        'Per Pupil Spending': 12900,
        'Total Budget': 528900000,
        'Title I': 72000000,
        'LCFF Supplemental': 168000000,
      },
    },
    {
      name: 'Garden Grove Unified School District',
      location: 'Garden Grove, CA',
      county: 'Orange',
      enrollment: 41000,
      demographics: {
        'Hispanic/Latino': 60.5,
        'Asian': 24.8,
        'White': 8.7,
        'African American': 1.9,
        'Filipino': 2.5,
        'Two or More Races': 1.6,
      },
      proficiency: {
        'Math': 36.4,
        'ELA': 42.7,
        'Science': 30.8,
      },
      funding: {
        'Per Pupil Spending': 13800,
        'Total Budget': 565800000,
        'Title I': 58000000,
        'LCFF Supplemental': 145000000,
      },
    },
    {
      name: 'Capistrano Unified School District',
      location: 'San Juan Capistrano, CA',
      county: 'Orange',
      enrollment: 47000,
      demographics: {
        'Hispanic/Latino': 32.8,
        'White': 48.5,
        'Asian': 12.3,
        'African American': 1.8,
        'Two or More Races': 4.6,
      },
      proficiency: {
        'Math': 52.7,
        'ELA': 58.3,
        'Science': 47.2,
      },
      funding: {
        'Per Pupil Spending': 11800,
        'Total Budget': 554600000,
        'Title I': 18000000,
        'LCFF Supplemental': 52000000,
      },
    },
    {
      name: 'Corona-Norco Unified School District',
      location: 'Corona, CA',
      county: 'Riverside',
      enrollment: 51000,
      demographics: {
        'Hispanic/Latino': 51.3,
        'White': 28.7,
        'Asian': 8.5,
        'African American': 6.8,
        'Two or More Races': 4.7,
      },
      proficiency: {
        'Math': 43.2,
        'ELA': 49.8,
        'Science': 38.5,
      },
      funding: {
        'Per Pupil Spending': 12400,
        'Total Budget': 632400000,
        'Title I': 38000000,
        'LCFF Supplemental': 95000000,
      },
    },
    {
      name: 'Clovis Unified School District',
      location: 'Clovis, CA',
      county: 'Fresno',
      enrollment: 43000,
      demographics: {
        'Hispanic/Latino': 42.8,
        'White': 38.5,
        'Asian': 11.2,
        'African American': 3.8,
        'Two or More Races': 3.7,
      },
      proficiency: {
        'Math': 51.3,
        'ELA': 56.9,
        'Science': 45.8,
      },
      funding: {
        'Per Pupil Spending': 11500,
        'Total Budget': 494500000,
        'Title I': 22000000,
        'LCFF Supplemental': 58000000,
      },
    },
    {
      name: 'Poway Unified School District',
      location: 'Poway, CA',
      county: 'San Diego',
      enrollment: 36000,
      demographics: {
        'Hispanic/Latino': 26.5,
        'White': 42.8,
        'Asian': 21.7,
        'African American': 3.2,
        'Filipino': 3.8,
        'Two or More Races': 2.0,
      },
      proficiency: {
        'Math': 56.8,
        'ELA': 61.4,
        'Science': 51.2,
      },
      funding: {
        'Per Pupil Spending': 11200,
        'Total Budget': 403200000,
        'Title I': 12000000,
        'LCFF Supplemental': 35000000,
      },
    },
    {
      name: 'Irvine Unified School District',
      location: 'Irvine, CA',
      county: 'Orange',
      enrollment: 37000,
      demographics: {
        'Hispanic/Latino': 14.2,
        'White': 29.8,
        'Asian': 50.5,
        'African American': 1.8,
        'Two or More Races': 3.7,
      },
      proficiency: {
        'Math': 68.9,
        'ELA': 72.4,
        'Science': 62.3,
      },
      funding: {
        'Per Pupil Spending': 10800,
        'Total Budget': 399600000,
        'Title I': 5000000,
        'LCFF Supplemental': 18000000,
      },
    },
    {
      name: 'Vista Unified School District',
      location: 'Vista, CA',
      county: 'San Diego',
      enrollment: 22000,
      demographics: {
        'Hispanic/Latino': 66.8,
        'White': 19.2,
        'Asian': 5.7,
        'African American': 3.8,
        'Filipino': 2.5,
        'Two or More Races': 2.0,
      },
      proficiency: {
        'Math': 35.8,
        'ELA': 42.3,
        'Science': 29.6,
      },
      funding: {
        'Per Pupil Spending': 13400,
        'Total Budget': 294800000,
        'Title I': 38000000,
        'LCFF Supplemental': 88000000,
      },
    },
    {
      name: 'Bakersfield City School District',
      location: 'Bakersfield, CA',
      county: 'Kern',
      enrollment: 30000,
      demographics: {
        'Hispanic/Latino': 72.5,
        'White': 17.8,
        'African American': 6.2,
        'Asian': 2.3,
        'Two or More Races': 1.2,
      },
      proficiency: {
        'Math': 27.4,
        'ELA': 35.6,
        'Science': 22.1,
      },
      funding: {
        'Per Pupil Spending': 12200,
        'Total Budget': 366000000,
        'Title I': 65000000,
        'LCFF Supplemental': 152000000,
      },
    },
    {
      name: 'Compton Unified School District',
      location: 'Compton, CA',
      county: 'Los Angeles',
      enrollment: 19000,
      demographics: {
        'Hispanic/Latino': 73.8,
        'African American': 24.2,
        'White': 0.8,
        'Asian': 0.7,
        'Pacific Islander': 0.5,
      },
      proficiency: {
        'Math': 18.5,
        'ELA': 24.8,
        'Science': 14.3,
      },
      funding: {
        'Per Pupil Spending': 16200,
        'Total Budget': 307800000,
        'Title I': 58000000,
        'LCFF Supplemental': 145000000,
      },
    },
    {
      name: 'Lodi Unified School District',
      location: 'Lodi, CA',
      county: 'San Joaquin',
      enrollment: 28000,
      demographics: {
        'Hispanic/Latino': 49.7,
        'White': 32.8,
        'Asian': 9.5,
        'African American': 4.2,
        'Two or More Races': 3.8,
      },
      proficiency: {
        'Math': 36.9,
        'ELA': 43.2,
        'Science': 31.5,
      },
      funding: {
        'Per Pupil Spending': 12600,
        'Total Budget': 352800000,
        'Title I': 42000000,
        'LCFF Supplemental': 98000000,
      },
    },
    {
      name: 'Manteca Unified School District',
      location: 'Manteca, CA',
      county: 'San Joaquin',
      enrollment: 25000,
      demographics: {
        'Hispanic/Latino': 56.8,
        'White': 27.3,
        'Asian': 8.2,
        'African American': 4.5,
        'Two or More Races': 3.2,
      },
      proficiency: {
        'Math': 38.4,
        'ELA': 44.7,
        'Science': 32.9,
      },
      funding: {
        'Per Pupil Spending': 12300,
        'Total Budget': 307500000,
        'Title I': 35000000,
        'LCFF Supplemental': 82000000,
      },
    },
    {
      name: 'Modesto City Schools',
      location: 'Modesto, CA',
      county: 'Stanislaus',
      enrollment: 29000,
      demographics: {
        'Hispanic/Latino': 63.5,
        'White': 22.8,
        'Asian': 7.2,
        'African American': 3.8,
        'Two or More Races': 2.7,
      },
      proficiency: {
        'Math': 31.7,
        'ELA': 38.9,
        'Science': 26.4,
      },
      funding: {
        'Per Pupil Spending': 12500,
        'Total Budget': 362500000,
        'Title I': 58000000,
        'LCFF Supplemental': 135000000,
      },
    },
  ];

  // Upsert all districts
  for (const district of districts) {
    await prisma.district.upsert({
      where: { name_county: { name: district.name, county: district.county } },
      update: district,
      create: district,
    });
  }

  console.log(`Seeded ${districts.length} California school districts`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed successfully');
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
