// PlaybookService domain types

import type { FitAssessment, ContentSource, SectionStatus } from './common';

export type PlaybookSectionType =
  | 'district_story'         // was 'district_data' — narrative lead with real metrics and trends
  | 'key_themes'             // kept — strategic themes bridging district context to product relevance
  | 'product_alignment'      // merged 'product_fit' + 'fit_assessment' — single alignment view with evidence
  | 'stakeholder_map'        // was 'stakeholders' — named roles + what each cares about
  | 'objection_handling'     // was 'objections' — conversation-ready objection/response pairs
  | 'conversation_playbook'; // NEW — tactical prep: opening, proof points, questions, next steps

export interface PlaybookSummary {
  playbookId: string;
  districtId: string;
  districtName: string;
  productIds: string[];
  productNames: string[];       // denormalized snapshot at generation time
  fitAssessment: FitAssessment;
  generatedAt: string;          // ISO 8601
  hasEditedSections: boolean;
  sectionStatuses: Record<string, SectionStatus>;
}

export interface Playbook {
  playbookId: string;
  districtId: string;
  districtName: string;
  productIds: string[];
  productNames: string[];
  fitAssessment: FitAssessment;
  generatedAt: string;          // ISO 8601
  sections: PlaybookSection[];
}

export interface PlaybookSection {
  sectionId: string;
  sectionType: PlaybookSectionType;
  sectionLabel: string;      // human-readable
  contentSource: ContentSource;
  status: SectionStatus;
  content?: string;          // null while pending/generating
  isEdited: boolean;
  lastEditedAt?: string;     // ISO 8601
  errorMessage?: string;     // populated when status is 'error'
  retryable: boolean;
}

export interface PlaybookFilters {
  fitScoreMin?: number;      // 0–10, filter playbooks by fit score
  fitScoreMax?: number;      // 0–10
  sortBy?: 'generatedAt' | 'districtName';
  sortOrder?: 'asc' | 'desc';
}

export interface PlaybookGenerationRequest {
  districtId: string;
  productIds: string[];
}

export interface PlaybookStatusResponse {
  playbookId: string;
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
  sections: {
    sectionId: string;
    sectionType: PlaybookSectionType;
    status: SectionStatus;
  }[];
}
