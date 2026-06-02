export interface VoiceTranslationRecord {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface VoiceTranslationState {
  isListening: boolean;
  isTranslating: boolean;
  history: VoiceTranslationRecord[];
  error: string | null;
}
