import type { IPlaybookService } from '../../interfaces/playbook-service';
import type { PaginatedRequest, PaginatedResponse, SectionStatus, MatchTier, MatchSummary } from '../../types/common';
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
import { DISTRICT_FIXTURES } from './fixtures/districts';

// === In-memory store (globalThis singleton survives HMR) ===

interface StoredPlaybook extends Playbook {
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}

interface PlaybookStore {
  playbooks: Map<string, StoredPlaybook>;
  idCounter: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __ak12_mock_playbooks__: PlaybookStore | undefined;
}

function getStore(): PlaybookStore {
  if (!globalThis.__ak12_mock_playbooks__) {
    globalThis.__ak12_mock_playbooks__ = {
      playbooks: new Map(),
      idCounter: 0,
    };
  }
  return globalThis.__ak12_mock_playbooks__;
}

function getPlaybooks(): Map<string, StoredPlaybook> {
  return getStore().playbooks;
}

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  const store = getStore();
  store.idCounter++;
  return `pb-${String(store.idCounter).padStart(4, '0')}`;
}

// Resolve superintendent name from districtId using fixtures
function resolveSuperintendentName(districtId: string): string | undefined {
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  if (!fixture) return undefined;
  const { superintendentFirstName, superintendentLastName } = fixture.district;
  if (superintendentFirstName && superintendentLastName) {
    return `${superintendentFirstName} ${superintendentLastName}`;
  }
  return undefined;
}

// Resolve superintendent contact info (phone/website) from districtId
function resolveSuperintendentContact(districtId: string): string {
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  if (!fixture) return '';
  const parts: string[] = [];
  if (fixture.district.phone) parts.push(`Phone: ${fixture.district.phone}`);
  if (fixture.district.website) parts.push(`Website: ${fixture.district.website}`);
  return parts.length > 0 ? parts.join(' · ') : '';
}

// Interpolate template placeholders with actual data
function interpolateTemplate(template: string, districtName: string, productNames: string[], superintendentName?: string, superintendentContact?: string): string {
  const productNameStr = productNames.join(' and ');
  const productList = productNames
    .map((name) => {
      const product = MOCK_PRODUCTS.find((p) => p.name === name);
      if (!product) return `${name}: Aligns with district priorities in ${name}'s subject area.`;
      return `${name} (${product.subjectArea}, Grades ${product.gradeRange.gradeFrom}\u2013${product.gradeRange.gradeTo}): ${product.description.split('.')[0]}. This aligns with the district's needs in ${product.subjectArea.toLowerCase()}.`;
    })
    .join('\n\n');

  const superintendentLine = superintendentName
    ? `**Superintendent ${superintendentName}**`
    : '**Superintendent**';

  return template
    .replace(/\{\{districtName\}\}/g, districtName)
    .replace(/\{\{productNames\}\}/g, productNameStr)
    .replace(/\{\{productList\}\}/g, productList)
    .replace(/\{\{superintendentLine\}\}/g, superintendentLine)
    .replace(/\{\{superintendentContact\}\}/g, superintendentContact || '');
}

// Resolve content for a section — district-specific first, generic template fallback
function resolveContent(
  districtId: string,
  sectionType: typeof SECTION_ORDER[number],
  districtName: string,
  productNames: string[],
  superintendentName?: string,
  superintendentContact?: string
): string {
  const districtContent = DISTRICT_SPECIFIC_CONTENT[districtId]?.[sectionType];
  if (districtContent) {
    return districtContent.content;
  }
  const template = GENERIC_SECTION_TEMPLATES[sectionType];
  return interpolateTemplate(template.template, districtName, productNames, superintendentName, superintendentContact);
}

// Resolve district name from districtId using fixtures
function resolveDistrictName(districtId: string): string {
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  return fixture ? fixture.district.name : 'California School District';
}

// Simulate progressive generation — sections complete one by one with delays
function simulateGeneration(playbookId: string): void {
  const playbook = getPlaybooks().get(playbookId);
  if (!playbook) return;

  const superintendentName = resolveSuperintendentName(playbook.districtId);
  const superintendentContact = resolveSuperintendentContact(playbook.districtId);

  SECTION_ORDER.forEach((sectionType, index) => {
    // Set to generating after a short delay
    setTimeout(() => {
      const pb = getPlaybooks().get(playbookId);
      if (!pb) return;
      const section = pb.sections.find((s) => s.sectionType === sectionType);
      if (section) {
        section.status = 'generating';
      }
    }, index * 1500);

    // Set to complete with content after a longer delay
    setTimeout(() => {
      const pb = getPlaybooks().get(playbookId);
      if (!pb) return;
      const section = pb.sections.find((s) => s.sectionType === sectionType);
      if (section) {
        section.content = resolveContent(
          pb.districtId,
          sectionType,
          pb.districtName,
          pb.productNames,
          superintendentName,
          superintendentContact
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

    // Validate district exists in fixtures
    const districtFixture = DISTRICT_FIXTURES.find((d) => d.district.id === request.districtId);
    if (!districtFixture) {
      throw { code: 'DISTRICT_NOT_FOUND', message: `District ${request.districtId} not found`, retryable: false };
    }

    // Resolve product names from IDs
    const productNames = request.productIds.map((id) => {
      const product = MOCK_PRODUCTS.find((p) => p.productId === id);
      return product ? product.name : `Unknown Product (${id})`;
    });

    const districtName = districtFixture.district.name;

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

    // Compute matchSummary from fitScore
    const fitScore = 7;
    const overallTier: MatchTier = fitScore >= 7 ? 'strong' : fitScore >= 4 ? 'moderate' : 'limited';
    const productLabel = productNames.join(' and ');
    const matchSummary: MatchSummary = {
      overallTier,
      headline: `${overallTier === 'strong' ? 'Strong' : overallTier === 'moderate' ? 'Moderate' : 'Limited'} alignment with ${districtName} priorities`,
      dimensions: [
        { key: 'goals_priorities', tier: overallTier, signals: [`District priorities align with ${productLabel} focus areas.`], productConnection: `${productLabel} directly addresses stated district goals.` },
        { key: 'student_population', tier: 'moderate', signals: ['Student demographics suggest moderate opportunity.'], productConnection: 'Product target population overlaps with district demographics.' },
      ],
      topSignals: [
        `District priorities align with ${productLabel} focus areas`,
        `${districtName} shows active evaluation signals`,
      ],
    };

    const playbook: StoredPlaybook = {
      playbookId,
      districtId: request.districtId,
      districtName,
      productIds: request.productIds,
      productNames,
      fitAssessment: { fitScore, fitRationale: 'Strong alignment with district priorities.' },
      matchSummary,
      generatedAt: now,
      sections,
      overallStatus: 'generating',
    };

    getPlaybooks().set(playbookId, playbook);

    // Start async generation simulation
    simulateGeneration(playbookId);

    return { playbookId };
  },

  async getPlaybookStatus(playbookId: string): Promise<PlaybookStatusResponse> {
    await delay(100);
    const playbook = getPlaybooks().get(playbookId);
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
    const playbook = getPlaybooks().get(playbookId);
    if (!playbook) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    // Return without the overallStatus field (not part of Playbook type)
    const { overallStatus, ...playbookData } = playbook;
    return JSON.parse(JSON.stringify(playbookData));
  },

  async getPlaybookSection(playbookId: string, sectionId: string): Promise<PlaybookSection> {
    await delay(100);
    const playbook = getPlaybooks().get(playbookId);
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
    let items = Array.from(getPlaybooks().values());

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
      matchSummary: p.matchSummary,
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
    const matching = Array.from(getPlaybooks().values()).filter((p) => p.districtId === districtId);
    return matching.map((p) => ({
      playbookId: p.playbookId,
      districtId: p.districtId,
      districtName: p.districtName,
      productIds: p.productIds,
      productNames: p.productNames,
      fitAssessment: p.fitAssessment,
      matchSummary: p.matchSummary,
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
    const playbook = getPlaybooks().get(playbookId);
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
    const playbook = getPlaybooks().get(playbookId);
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
      const pb = getPlaybooks().get(playbookId);
      if (!pb) return;
      const sec = pb.sections.find((s) => s.sectionId === sectionId);
      if (!sec) return;
      sec.content = resolveContent(
        pb.districtId,
        sec.sectionType,
        pb.districtName,
        pb.productNames,
        resolveSuperintendentName(pb.districtId),
        resolveSuperintendentContact(pb.districtId)
      );
      sec.status = 'complete';
      const allComplete = pb.sections.every((s) => s.status === 'complete');
      pb.overallStatus = allComplete ? 'complete' : 'partial';
    }, 3000);

    return { status: 'generating' };
  },

  async deletePlaybook(playbookId: string): Promise<void> {
    await delay(200);
    if (!getPlaybooks().has(playbookId)) {
      throw { code: 'PLAYBOOK_NOT_FOUND', message: `Playbook ${playbookId} not found`, retryable: false };
    }
    getPlaybooks().delete(playbookId);
  },
};
