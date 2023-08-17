export type Utterance = {
  transcription: string;
  confidence: number;
  language: string;
  type: 'partial' | 'final';
  time_begin: number;
  time_end: number;
};
