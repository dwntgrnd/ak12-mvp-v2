import type { Playbook, PlaybookSection, PlaybookSectionType } from '../../../types/playbook';
import type { ContentSource, SectionStatus } from '../../../types/common';
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
    // #1 — Typical card, multi-product, strong fit
    playbookId: 'pb-seed-001',
    districtId: 'dist-la-001',
    districtName: 'Los Angeles Unified',
    productIds: ['prod-001', 'prod-002'],
    productNames: ['EnvisionMath', 'myPerspectives'],
    fitAssessment: { fitScore: 8, fitRationale: 'Strong alignment across math and ELA priorities with documented needs in both subject areas.' },
    generatedAt: new Date(now - 1 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-001', 'dist-la-001', 'Los Angeles Unified', ['EnvisionMath', 'myPerspectives']),
    overallStatus: 'complete',
  },
  {
    // #2 — Single product, moderate fit
    playbookId: 'pb-seed-002',
    districtId: 'dist-sf-001',
    districtName: 'San Francisco Unified',
    productIds: ['prod-002'],
    productNames: ['myPerspectives'],
    fitAssessment: { fitScore: 5, fitRationale: 'Moderate alignment — ELA needs present but competing programs already in evaluation.' },
    generatedAt: new Date(now - 3 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-002', 'dist-sf-001', 'San Francisco Unified', ['myPerspectives']),
    overallStatus: 'complete',
  },
  {
    // #3 — Multi-product, strong fit (originally 3 products — only 2 available in fixtures)
    playbookId: 'pb-seed-003',
    districtId: 'dist-sac-001',
    districtName: 'Sacramento City Unified',
    productIds: ['prod-001', 'prod-002'],
    productNames: ['EnvisionMath', 'myPerspectives'],
    fitAssessment: { fitScore: 9, fitRationale: 'Excellent alignment — district actively seeking new math and ELA materials for upcoming adoption cycle.' },
    generatedAt: new Date(now - 5 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-003', 'dist-sac-001', 'Sacramento City Unified', ['EnvisionMath', 'myPerspectives']),
    overallStatus: 'complete',
  },
  {
    // #4 — Low fit styling
    playbookId: 'pb-seed-004',
    districtId: 'dist-fre-001',
    districtName: 'Fresno Unified',
    productIds: ['prod-001'],
    productNames: ['EnvisionMath'],
    fitAssessment: { fitScore: 2, fitRationale: 'Low alignment — district recently adopted a competing math program with a 5-year contract.' },
    generatedAt: new Date(now - 7 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-004', 'dist-fre-001', 'Fresno Unified', ['EnvisionMath']),
    overallStatus: 'complete',
  },
  {
    // #5 — Generating status badge
    playbookId: 'pb-seed-005',
    districtId: 'dist-sd-001',
    districtName: 'San Diego Unified',
    productIds: ['prod-001', 'prod-002'],
    productNames: ['EnvisionMath', 'myPerspectives'],
    fitAssessment: { fitScore: 7, fitRationale: 'Strong alignment with district STEM and literacy initiatives.' },
    generatedAt: new Date(now - 0.5 * DAY).toISOString(),
    sections: buildGeneratingSections('pb-seed-005', 'San Diego Unified', ['EnvisionMath', 'myPerspectives']),
    overallStatus: 'generating',
  },
  {
    // #6 — Error status badge
    playbookId: 'pb-seed-006',
    districtId: 'dist-oak-001',
    districtName: 'Oakland Unified',
    productIds: ['prod-002'],
    productNames: ['myPerspectives'],
    fitAssessment: { fitScore: 6, fitRationale: 'Moderate alignment — strong ELA needs but budget constraints limit near-term adoption.' },
    generatedAt: new Date(now - 2 * DAY).toISOString(),
    sections: buildErrorSections('pb-seed-006', 'Oakland Unified', ['myPerspectives']),
    overallStatus: 'failed',
  },
  {
    // #7 — Additional complete card for grid density
    playbookId: 'pb-seed-007',
    districtId: 'dist-lb-001',
    districtName: 'Long Beach Unified',
    productIds: ['prod-001', 'prod-002'],
    productNames: ['EnvisionMath', 'myPerspectives'],
    fitAssessment: { fitScore: 8, fitRationale: 'Strong alignment — district piloting new math curriculum and evaluating ELA supplements.' },
    generatedAt: new Date(now - 10 * DAY).toISOString(),
    sections: buildCompleteSections('pb-seed-007', 'dist-lb-001', 'Long Beach Unified', ['EnvisionMath', 'myPerspectives']),
    overallStatus: 'complete',
  },
];
