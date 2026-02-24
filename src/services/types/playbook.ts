// PlaybookService domain types

import type { FitAssessment, MatchSummary, ContentSource, SectionStatus } from './common';

export type PlaybookSectionType =
  | 'key_themes'
  | 'stakeholder_talking_points'
  | 'product_fit_data'
  | 'handling_objections'
  | 'competition'
  | 'news';

export interface PlaybookSummary {
  playbookId: string;
  districtId: string;
  districtName: string;
  productIds: string[];
  productNames: string[];       // denormalized snapshot at generation time
  /** @deprecated Use matchSummary instead */
  fitAssessment: FitAssessment;
  matchSummary?: MatchSummary;
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
  /** @deprecated Use matchSummary instead */
  fitAssessment: FitAssessment;
  matchSummary?: MatchSummary;
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
