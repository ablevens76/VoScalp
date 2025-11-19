export interface WordUnit {
  id: string;
  original: string;
  phonetic: string;
  stress: boolean; // If true, capitalize the word
  spacing: number; // 0-3, number of hyphens/pauses to append
  isLocked: boolean; // If true, AI won't overwrite this
}

export enum AppTab {
  EDITOR = 'EDITOR',
  LIMITS = 'LIMITS',
}

export enum AccentType {
  GENERAL_AMERICAN = 'General American',
  BRITISH_RP = 'British (RP)',
  SCOTTISH = 'Scottish',
  US_SOUTHERN = 'US Southern',
  AAVE = 'AAVE',
  PATOIS = 'Patois',
  FRENCH_CODED = 'French-Coded English',
  GERMAN_CODED = 'German-Coded English',
  OLD_ENGLISH = 'Old English / Medieval',
}

export interface AiProcessingStatus {
  isProcessing: boolean;
  message: string;
  error?: string;
}
