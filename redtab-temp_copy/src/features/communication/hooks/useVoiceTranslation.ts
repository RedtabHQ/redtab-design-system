import { useState, useCallback } from 'react';
import { VoiceTranslationRecord } from '../types';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition {
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface Window {
  webkitSpeechRecognition?: new () => SpeechRecognition;
  SpeechRecognition?: new () => SpeechRecognition;
}

export const useVoiceTranslation = () => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<VoiceTranslationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(async (lang: string = 'en-US') => {
    try {
      setError(null);
      setIsListening(true);

      const SpeechRecognitionConstructor =
        (window as unknown as Window).webkitSpeechRecognition ||
        (window as unknown as Window).SpeechRecognition;

      if (!SpeechRecognitionConstructor) {
        setError('Speech Recognition not supported in this browser');
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        return transcript;
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start listening');
      setIsListening(false);
    }
  }, []);

  const translate = useCallback((text: string, sourceLang: string, targetLang: string) => {
    setIsTranslating(true);
    setError(null);

    try {
      // Mock translation - replace with actual API call
      const translatedText = `[${targetLang}] ${text}`;

      const record: VoiceTranslationRecord = {
        id: `${Date.now()}`,
        sourceText: text,
        translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date(),
      };

      setHistory((prev) => [record, ...prev]);
      setIsTranslating(false);
      return record;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setIsTranslating(false);
      return null;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    isListening,
    isTranslating,
    history,
    error,
    startListening,
    translate,
    clearHistory,
    deleteFromHistory,
  };
};
