// PlaybookService domain types

import type { FitAssessment, FitCategory, ContentSource, SectionStatus } from './common';

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
  sectionType: string;       // 'key_themes', 'product_fit', 'objections', 'stakeholders', 'district_data', 'fit_assessment'
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
  fitCategory?: FitCategory;
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
    sectionType: string;
    status: SectionStatus;
  }[];
}
