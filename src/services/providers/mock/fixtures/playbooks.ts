import type { Playbook, PlaybookSection, PlaybookSectionType } from '../../../types/playbook';
import type { ContentSource, SectionStatus, MatchSummary } from '../../../types/common';
import { SECTION_ORDER, GENERIC_SECTION_TEMPLATES, DISTRICT_SPECIFIC_CONTENT } from './playbook-content';

// StoredPlaybook shape matches the in-memory store in mock-playbook-service.ts
interface StoredPlaybook extends Playbook {
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}

// Interpolate template placeholders with actual data
function interpolateTemplate(template: string, districtName: string, productNames: string[]): string {
  const productNameStr = productNames.join(' and ');
  const productList = productNames
    .map((name) => `${name}: Aligns with district priorities in the subject area.`)
    .join('\n\n');

  return template
    .replace(/\{\{districtName\}\}/g, districtName)
    .replace(/\{\{productNames\}\}/g, productNameStr)
    .replace(/\{\{productList\}\}/g, productList);
}

function buildCompleteSections(
  playbookId: string,
  districtId: string,
  districtName: string,
  productNames: string[]
): PlaybookSection[] {
  return SECTION_ORDER.map((sectionType, index) => {
    // Check for district-specific content first
    const districtContent = DISTRICT_SPECIFIC_CONTENT[districtId]?.[sectionType];

    if (districtContent) {
      return {
        sectionId: `${playbookId}-sec-${String(index + 1).padStart(3, '0')}`,
        sectionType,
        sectionLabel: districtContent.sectionLabel,
        contentSource: districtContent.contentSource,
        status: 'complete' as SectionStatus,
        content: districtContent.content,
        isEdited: false,
        retryable: true,
      };
    }

    // Fall back to generic template with interpolation
    const template = GENERIC_SECTION_TEMPLATES[sectionType];
    const content = interpolateTemplate(template.template, districtName, productNames);
    return {
      sectionId: `${playbookId}-sec-${String(index + 1).padStart(3, '0')}`,
      sectionType,
      sectionLabel: template.sectionLabel,
      contentSource: template.contentSource,
      status: 'complete' as SectionStatus,
      content,
      isEdited: false,
      retryable: true,
    };
  });
}

function buildGeneratingSections(
  playbookId: string,
  districtName: string,
  productNames: string[]
): PlaybookSection[] {
  return SECTION_ORDER.map((sectionType, index) => {
    const template = GENERIC_SECTION_TEMPLATES[sectionType];
    // First 2 sections complete, next one generating, rest pending
    let status: SectionStatus;
    if (index < 2) status = 'complete';
    else if (index === 2) status = 'generating';
    else status = 'pending';

    const content = status === 'complete'
      ? interpolateTemplate(template.template, districtName, productNames)
      : undefined;

    return {
      sectionId: `${playbookId}-sec-${String(index + 1).padStart(3, '0')}`,
      sectionType,
      sectionLabel: template.sectionLabel,
      contentSource: template.contentSource,
      status,
      content,
      isEdited: false,
      retryable: true,
    };
  });
}

function buildErrorSections(
  playbookId: string,
  districtName: string,
  productNames: string[]
): PlaybookSection[] {
  return SECTION_ORDER.map((sectionType, index) => {
    const template = GENERIC_SECTION_TEMPLATES[sectionType];
    // Most sections complete, one has error (stakeholder_map at index 3)
    const status: SectionStatus = index === 3 ? 'error' : 'complete';

    const content = status === 'complete'
      ? interpolateTemplate(template.template, districtName, productNames)
      : undefined;

    return {
      sectionId: `${playbookId}-sec-${String(index + 1).padStart(3, '0')}`,
      sectionType,
      sectionLabel: template.sectionLabel,
      contentSource: template.contentSource,
      status,
      content,
      isEdited: false,
      errorMessage: status === 'error' ? 'Generation failed due to an internal error.' : undefined,
      retryable: true,
    };
  });
}

// Date spread: 7 playbooks over the past 2 weeks. Most recent first when sorted by date.
const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;

export const SEED_PLAYBOOKS: StoredPlaybook[] = [
  {
    // #4 — Low fit styling
    playbookId: 'pb-seed-004',
    districtId: '75c04266-c622-4294-aa22-046245c95e51',
    districtName: 'Fresno Unified',
    productIds: ['prod-001'],
    productNames: ['EnvisionMath'],
    fitAssessment: { fitScore: 2, fitRationale: 'Low alignment — district recently adopted a competing math program with a 5-year contract.' },
    matchSummary: {
      overallTier: 'limited',
      headline: 'District recently adopted a competing math program',
      dimensions: [
        { key: 'competitive_landscape', tier: 'limited', signals: ['Competing math program adopted with a 5-year contract.'], productConnection: 'Product competes directly with current adoption.' },
        { key: 'goals_priorities', tier: 'moderate', signals: ['Large district with math needs but evaluation timing unclear.'], productConnection: 'Product addresses math intervention needs.' },
      ],
      topSignals: [
        'Competing math program adopted with a 5-year contract',
        'Large district with math needs but evaluation status unknown',
      ],
    },
    generatedAt: new Date(now - 7 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-004', '75c04266-c622-4294-aa22-046245c95e51', 'Fresno Unified', ['EnvisionMath']),
    overallStatus: 'complete',
  },
  {
    // #5 — Generating status badge
    playbookId: 'pb-seed-005',
    districtId: '48e9f362-9690-44e5-b8a2-362a24f30e58',
    districtName: 'San Diego Unified',
    productIds: ['prod-001', 'prod-002'],
    productNames: ['EnvisionMath', 'myPerspectives'],
    fitAssessment: { fitScore: 7, fitRationale: 'Strong alignment with district STEM and literacy initiatives.' },
    matchSummary: {
      overallTier: 'strong',
      headline: 'Strong alignment with district STEM and literacy initiatives',
      dimensions: [
        { key: 'goals_priorities', tier: 'strong', signals: ['District STEM and literacy initiatives align with both product areas.'], productConnection: 'Products directly support district STEM and literacy goals.' },
        { key: 'student_population', tier: 'strong', signals: ['Large diverse student population benefits from multi-subject approach.'], productConnection: 'Product suite covers diverse learner needs across subjects.' },
        { key: 'academic_need', tier: 'moderate', signals: ['Math and ELA proficiency gaps present across grade spans.'], productConnection: 'Products address identified proficiency gaps in math and ELA.' },
      ],
      topSignals: [
        'District STEM and literacy initiatives align with both product areas',
        'Large diverse student population benefits from multi-subject approach',
      ],
    },
    generatedAt: new Date(now - 0.5 * DAY).toISOString(),
    sections: buildGeneratingSections('pb-seed-005', 'San Diego Unified', ['EnvisionMath', 'myPerspectives']),
    overallStatus: 'generating',
  },
  {
    // #6 — Error status badge
    playbookId: 'pb-seed-006',
    districtId: '89e89add-4b95-47b5-a8e1-ae3b92fadf73',
    districtName: 'Oakland Unified',
    productIds: ['prod-002'],
    productNames: ['myPerspectives'],
    fitAssessment: { fitScore: 6, fitRationale: 'Moderate alignment — strong ELA needs but budget constraints limit near-term adoption.' },
    matchSummary: {
      overallTier: 'moderate',
      headline: 'Strong ELA needs but budget constraints limit near-term adoption',
      dimensions: [
        { key: 'academic_need', tier: 'strong', signals: ['ELA proficiency gaps indicate strong need for intervention materials.'], productConnection: 'Product directly addresses ELA intervention needs.' },
        { key: 'budget_capacity', tier: 'limited', signals: ['Budget constraints limit near-term adoption capacity.'], productConnection: 'Product pricing may challenge current budget availability.' },
        { key: 'goals_priorities', tier: 'moderate', signals: ['ELA improvement referenced in LCAP but not top priority.'], productConnection: 'Product aligns with stated but non-priority ELA goals.' },
      ],
      topSignals: [
        'Strong ELA needs across multiple grade spans',
        'Budget constraints limit near-term adoption capacity',
      ],
    },
    generatedAt: new Date(now - 2 * DAY).toISOString(),
    sections: buildErrorSections('pb-seed-006', 'Oakland Unified', ['myPerspectives']),
    overallStatus: 'failed',
  },
  {
    // #7 — Additional complete card for grid density
    playbookId: 'pb-seed-007',
    districtId: '7c2603bd-7cca-414f-8813-320d8ef2020b',
    districtName: 'Long Beach Unified',
    productIds: ['prod-001', 'prod-002'],
    productNames: ['EnvisionMath', 'myPerspectives'],
    fitAssessment: { fitScore: 8, fitRationale: 'Strong alignment — district piloting new math curriculum and evaluating ELA supplements.' },
    matchSummary: {
      overallTier: 'strong',
      headline: 'District piloting new math curriculum and evaluating ELA supplements',
      dimensions: [
        { key: 'goals_priorities', tier: 'strong', signals: ['Active math curriculum pilot and ELA supplement evaluation in progress.'], productConnection: 'Products align with active pilot and evaluation cycles.' },
        { key: 'academic_need', tier: 'strong', signals: ['Math and ELA proficiency trends warrant new instructional materials.'], productConnection: 'Products address identified proficiency gaps in both subjects.' },
        { key: 'budget_capacity', tier: 'moderate', signals: ['Budget allocated for pilot phase; full adoption funding TBD.'], productConnection: 'Product pricing fits within pilot budget allocation.' },
      ],
      topSignals: [
        'District piloting new math curriculum with active evaluation timeline',
        'ELA supplement evaluation underway alongside math pilot',
      ],
    },
    generatedAt: new Date(now - 10 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-007', '7c2603bd-7cca-414f-8813-320d8ef2020b', 'Long Beach Unified', ['EnvisionMath', 'myPerspectives']),
    overallStatus: 'complete',
  },
];
