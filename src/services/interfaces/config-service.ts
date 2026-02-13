// ConfigService interface

export interface IConfigService {
  // Authorization: any authenticated user
  // Returns allowed values for a controlled vocabulary field.
  // Known vocabularies: 'subjectArea'
  getControlledVocabulary(vocabularyName: string): Promise<string[]>;
}
