// PlaybookService interface

import type { PaginatedRequest, PaginatedResponse } from '../types/common';
import type {
  PlaybookSummary,
  Playbook,
  PlaybookSection,
  PlaybookNote,
  PlaybookAttachment,
  PlaybookFilters,
  PlaybookGenerationRequest,
  PlaybookStatusResponse
} from '../types/playbook';

export interface IPlaybookService {
  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND, GENERATION_LIMIT_REACHED
  // Async: returns immediately; poll getPlaybookStatus for progress
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
  getPlaybooks(filters?: PlaybookFilters, pagination?: PaginatedRequest): Promise<PaginatedResponse<PlaybookSummary>>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND
  getExistingPlaybooks(districtId: string): Promise<PlaybookSummary[]>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND, SECTION_NOT_FOUND
  updatePlaybookSection(playbookId: string, sectionId: string, content: string): Promise<PlaybookSection>;

  // Authorization: publisher-admin, publisher-rep (own playbooks)
  // Errors: PLAYBOOK_NOT_FOUND, SECTION_NOT_FOUND, NOT_REGENERABLE
  // Async: returns immediately; poll getPlaybookStatus for updated section content
  regenerateSection(playbookId: string, sectionId: string): Promise<{ status: 'generating' }>;

  // Authorization: publisher-admin, publisher-rep (own playbooks, soft delete)
  // Errors: PLAYBOOK_NOT_FOUND
  deletePlaybook(playbookId: string): Promise<void>;

  // Notes & Attachments
  addNote(playbookId: string, content: string): Promise<PlaybookNote>;
  updateNote(playbookId: string, noteId: string, content: string): Promise<PlaybookNote>;
  deleteNote(playbookId: string, noteId: string): Promise<void>;
  addAttachment(playbookId: string, file: { fileName: string; fileType: string; fileSize: number; dataUrl: string }): Promise<PlaybookAttachment>;
  removeAttachment(playbookId: string, attachmentId: string): Promise<void>;
}
