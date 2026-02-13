import type { IConfigService } from '../../interfaces/config-service';
import { MOCK_SUBJECT_AREAS } from './fixtures/controlled-vocabulary';

export const mockConfigService: IConfigService = {
  async getControlledVocabulary(vocabularyName: string): Promise<string[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    switch (vocabularyName) {
      case 'subjectArea':
        return MOCK_SUBJECT_AREAS;
      default:
        throw { code: 'VOCABULARY_NOT_FOUND', message: `Unknown vocabulary: ${vocabularyName}`, retryable: false };
    }
  },
};
