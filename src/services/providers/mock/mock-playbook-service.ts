import type { IPlaybookService } from '../../interfaces/playbook-service';
import type { PaginatedRequest, PaginatedResponse, SectionStatus } from '../../types/common';
import type {
  PlaybookSummary,
  Playbook,
  PlaybookSection,
  PlaybookFilters,
  PlaybookGenerationRequest,
  PlaybookStatusResponse,
} from '../../types/playbook';
import { SECTION_ORDER, GENERIC_SECTION_TEMPLATES, DISTRICT_SPECIFIC_CONTENT } from './fixtures/playbook-content';
import { MOCK_PRODUCTS } from './fixtures/products';
import { SEED_PLAYBOOKS } from './fixtures/playbooks';
import { DISTRICT_FIXTURES } from './fixtures/districts';

// === In-memory store ===

interface StoredPlaybook extends Playbook {
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}

// Initialize with seed data for immediate list view testing
const playbooks: Map<string, StoredPlaybook> = new Map(
  SEED_PLAYBOOKS.map(pb => [pb.playbookId, pb])
);
let idCounter = SEED_PLAYBOOKS.length;

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  idCounter++;
  return `pb-${String(idCounter).padStart(4, '0')}`;
}

// Interpolate template placeholders with actual data
function interpolateTemplate(template: string, districtName: string, productNames: string[]): string {
  const productNameStr = productNames.join(' and ');
  const productList = productNames
    .map((name) => {
      const product = MOCK_PRODUCTS.find((p) => p.name === name);
      if (!product) return `${name}: Aligns with district priorities in ${name}'s subject area.`;
      return `${name} (${product.subjectArea}, Grades ${product.gradeRange.gradeFrom}\u2013${product.gradeRange.gradeTo}): ${product.description.split('.')[0]}. This aligns with the district's needs in ${product.subjectArea.toLowerCase()}.`;
    })
    .join('\n\n');

  return template
    .replace(/\{\{districtName\}\}/g, districtName)
    .replace(/\{\{productNames\}\}/g, productNameStr)
    .replace(/\{\{productList\}\}/g, productList);
}

// Resolve content for a section — district-specific first, generic template fallback
function resolveContent(
  districtId: string,
  sectionType: typeof SECTION_ORDER[number],
  districtName: string,
  productNames: string[]
): string {
  const districtContent = DISTRICT_SPECIFIC_CONTENT[districtId]?.[sectionType];
  if (districtContent) {
    return districtContent.content;
  }
  const template = GENERIC_SECTION_TEMPLATES[sectionType];
  return interpolateTemplate(template.template, districtName, productNames);
}

// Resolve district name from districtId using fixtures
function resolveDistrictName(districtId: string): string {
  // Map seed districtIds to fixture district names
  const SEED_DISTRICT_MAP: Record<string, string> = {
    'dist-la-001': 'Los Angeles Unified',
    'dist-sd-001': 'San Diego Unified',
    'dist-sf-001': 'San Francisco Unified',
    'dist-sac-001': 'Sacramento City Unified',
    'dist-fre-001': 'Fresno Unified',
    'dist-oak-001': 'Oakland Unified',
    'dist-lb-001': 'Long Beach Unified',
    'dist-tr-001': 'Twin Rivers Unified',
    'dist-nat-001': 'Natomas Unified',
    'dist-plumas-001': 'Plumas County Office of Education',
  };

  if (SEED_DISTRICT_MAP[districtId]) {
    return SEED_DISTRICT_MAP[districtId];
  }

  // Try to find in DISTRICT_FIXTURES by id
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  if (fixture) {
    return fixture.district.name;
  }

  return 'California School District';
}

// Simulate progressive generation — sections complete one by one with delays
function simulateGeneration(playbookId: string): void {
  const playbook = playbooks.get(playbookId);
  if (!playbook) return;

  SECTION_ORDER.forEach((sectionType, index) => {
    // Set to generating after a short delay
    setTimeout(() => {
      const pb = playbooks.get(playbookId);
      if (!pb) return;
      const section = pb.sections.find((s) => s.sectionType === sectionType);
      if (section) {
        section.status = 'generating';
      }
    }, index * 1500);

    // Set to complete with content after a longer delay
    setTimeout(() => {
      const pb = playbooks.get(playbookId);
      if (!pb) return;
      const section = pb.sections.find((s) => s.sectionType === sectionType);
      if (section) {
        section.content = resolveContent(
          pb.districtId,
          sectionType,
          pb.districtName,
          pb.productNames
        );
        section.status = 'complete';
      }

      // Check if all sections are complete
      const allComplete = pb.sections.every((s) => s.status === 'complete');
      const anyError = pb.sections.some((s) => s.status === 'error');
      if (allComplete) {
        pb.overallStatus = 'complete';
      } else if (anyError) {
        pb.overallStatus = 'partial';
      }
    }, index * 1500 + 2000);
  });
}

export const mockPlaybookService: IPlaybookService = {
  async generatePlaybook(request: PlaybookGenerationRequest): Promise<{ playbookId: string }> {
    await delay(300);

    // Resolve product names from IDs
    const productNames = request.productIds.map((id) => {
      const product = MOCK_PRODUCTS.find((p) => p.productId === id);
      return product ? product.name : `Unknown Product (${id})`;
    });

    const districtName = resolveDistrictName(request.districtId);

    const playbookId = generateId();
    const now = new Date().toISOString();

    const sections: PlaybookSection[] = SECTION_ORDER.map((sectionType, index) => {
      const template = GENERIC_SECTION_TEMPLATES[sectionType];
      return {
        sectionId: `${playbookId}-sec-${String(index + 1).padStart(3, '0')}`,
        sectionType,
        sectionLabel: template.sectionLabel,
        contentSource: template.contentSource,
        status: 'pending' as SectionStatus,
        content: undefined,
        isEdited: false,
        retryable: true,
      };
    });

    const playbook: StoredPlaybook = {
      playbookId,
      districtId: request.districtId,
      districtName,
      productIds: request.productIds,
      productNames,
      fitAssessment: { fitScore: 7, fitRationale: 'Strong alignment with district priorities.' },
      generatedAt: now,
      sections,
      overallStatus: 'generating',
    };

    playbooks.set(playbookId, playbook);

    // Start async generation simulation
    simulateGeneration(playbookId);

    return { playbookId };
  },

  async getPlaybookStatus(playbookId: string): Promise<PlaybookStatusResponse> {
    await delay(100);
    const playbook = playbooks.get(playbookId);
    if (!playbook) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    return {
      playbookId,
      overallStatus: playbook.overallStatus,
      sections: playbook.sections.map((s) => ({
        sectionId: s.sectionId,
        sectionType: s.sectionType,
        status: s.status,
      })),
    };
  },

  async getPlaybook(playbookId: string): Promise<Playbook> {
    await delay(200);
    const playbook = playbooks.get(playbookId);
    if (!playbook) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    // Return without the overallStatus field (not part of Playbook type)
    const { overallStatus, ...playbookData } = playbook;
    return JSON.parse(JSON.stringify(playbookData));
  },

  async getPlaybookSection(playbookId: string, sectionId: string): Promise<PlaybookSection> {
    await delay(100);
    const playbook = playbooks.get(playbookId);
    if (!playbook) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    const section = playbook.sections.find((s) => s.sectionId === sectionId);
    if (!section) {
      throw { code: 'SECTION_NOT_FOUND', message: `Section ${sectionId} not found`, retryable: false };
    }
    return JSON.parse(JSON.stringify(section));
  },

  async getPlaybooks(
    filters?: PlaybookFilters,
    pagination?: PaginatedRequest
  ): Promise<PaginatedResponse<PlaybookSummary>> {
    await delay(200);
    let items = Array.from(playbooks.values());

    if (filters?.fitScoreMin !== undefined) {
      items = items.filter((p) => p.fitAssessment.fitScore >= filters.fitScoreMin!);
    }
    if (filters?.fitScoreMax !== undefined) {
      items = items.filter((p) => p.fitAssessment.fitScore <= filters.fitScoreMax!);
    }

    // Sort
    const sortBy = filters?.sortBy || 'generatedAt';
    const sortOrder = filters?.sortOrder || 'desc';
    items.sort((a, b) => {
      const aVal = sortBy === 'districtName' ? a.districtName : a.generatedAt;
      const bVal = sortBy === 'districtName' ? b.districtName : b.generatedAt;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 25;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    const summaries: PlaybookSummary[] = paged.map((p) => ({
      playbookId: p.playbookId,
      districtId: p.districtId,
      districtName: p.districtName,
      productIds: p.productIds,
      productNames: p.productNames,
      fitAssessment: p.fitAssessment,
      generatedAt: p.generatedAt,
      hasEditedSections: p.sections.some((s) => s.isEdited),
      sectionStatuses: Object.fromEntries(p.sections.map((s) => [s.sectionType, s.status])),
    }));

    return {
      items: summaries,
      totalCount: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    };
  },

  async getExistingPlaybooks(districtId: string): Promise<PlaybookSummary[]> {
    await delay(100);
    const matching = Array.from(playbooks.values()).filter((p) => p.districtId === districtId);
    return matching.map((p) => ({
      playbookId: p.playbookId,
      districtId: p.districtId,
      districtName: p.districtName,
      productIds: p.productIds,
      productNames: p.productNames,
      fitAssessment: p.fitAssessment,
      generatedAt: p.generatedAt,
      hasEditedSections: p.sections.some((s) => s.isEdited),
      sectionStatuses: Object.fromEntries(p.sections.map((s) => [s.sectionType, s.status])),
    }));
  },

  async updatePlaybookSection(
    playbookId: string,
    sectionId: string,
    content: string
  ): Promise<PlaybookSection> {
    await delay(200);
    const playbook = playbooks.get(playbookId);
    if (!playbook) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    const section = playbook.sections.find((s) => s.sectionId === sectionId);
    if (!section) {
      throw { code: 'SECTION_NOT_FOUND', message: `Section ${sectionId} not found`, retryable: false };
    }
    section.content = content;
    section.isEdited = true;
    section.lastEditedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(section));
  },

  async regenerateSection(
    playbookId: string,
    sectionId: string
  ): Promise<{ status: 'generating' }> {
    await delay(200);
    const playbook = playbooks.get(playbookId);
    if (!playbook) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    const section = playbook.sections.find((s) => s.sectionId === sectionId);
    if (!section) {
      throw { code: 'SECTION_NOT_FOUND', message: `Section ${sectionId} not found`, retryable: false };
    }

    // Clear content and mark as generating
    section.status = 'generating';
    section.content = undefined;
    section.isEdited = false;
    section.lastEditedAt = undefined;
    playbook.overallStatus = 'generating';

    // Simulate regeneration delay, then restore content
    setTimeout(() => {
      const pb = playbooks.get(playbookId);
      if (!pb) return;
      const sec = pb.sections.find((s) => s.sectionId === sectionId);
      if (!sec) return;
      sec.content = resolveContent(
        pb.districtId,
        sec.sectionType,
        pb.districtName,
        pb.productNames
      );
      sec.status = 'complete';
      const allComplete = pb.sections.every((s) => s.status === 'complete');
      pb.overallStatus = allComplete ? 'complete' : 'partial';
    }, 3000);

    return { status: 'generating' };
  },

  async deletePlaybook(playbookId: string): Promise<void> {
    await delay(200);
    if (!playbooks.has(playbookId)) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    playbooks.delete(playbookId);
  },
};
