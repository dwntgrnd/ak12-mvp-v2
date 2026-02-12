// PlaybookService interface

import type {
  PlaybookSummary,
  Playbook,
  PlaybookSection,
  PlaybookFilters,
  PlaybookGenerationRequest,
  PlaybookStatusResponse
} from '../types/playbook';

export interface IPlaybookService {
  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND, GENERATION_LIMIT_REACHED
  // Async: returns immediately; poll getPlaybookStatus or use SSE for progress
  generatePlaybook(request: PlaybookGenerationRequest): Promise<{ playbookId: string }>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND
  getPlaybookStatus(playbookId: string): Promise<PlaybookStatusResponse>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND
  getPlaybook(playbookId: string): Promise<Playbook>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND, SECTION_NOT_FOUND
  getPlaybookSection(playbookId: string, sectionId: string): Promise<PlaybookSection>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  getPlaybooks(filters?: PlaybookFilters): Promise<PlaybookSummary[]>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND
  getExistingPlaybooks(districtId: string): Promise<PlaybookSummary[]>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND, SECTION_NOT_FOUND
  updatePlaybookSection(playbookId: string, sectionId: string, content: string): Promise<PlaybookSection>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND, SECTION_NOT_FOUND, NOT_REGENERABLE
  // Async: returns immediately; poll or use SSE for updated section content
  regenerateSection(playbookId: string, sectionId: string): Promise<{ status: 'generating' }>;

  // Authorization: publisher-admin, publisher-rep (own playbooks, soft delete)
  // Errors: PLAYBOOK_NOT_FOUND
  deletePlaybook(playbookId: string): Promise<void>;
}
