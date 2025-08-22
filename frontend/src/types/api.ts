// Types derived from OpenAPI specification

export type Severity = 'low' | 'medium' | 'high';
export type TextLabel = 'phishing' | 'legit' | 'suspicious';
export type DocumentLabel = 'suspicious' | 'legit' | 'forged';
export type AudioLabel = 'deepfake' | 'real' | 'suspicious';
export type Modality = 'text' | 'document' | 'audio';

export interface TextHighlight {
  start: number;
  end: number;
  reason: string;
  severity: Severity;
}

export interface TextAnalysisResult {
  label: TextLabel;
  score: number;
  highlights: TextHighlight[];
  reasons: string[];
  model_version: string;
}

export interface DocumentFinding {
  bbox: [number, number, number, number]; // [x, y, width, height]
  page?: number;
  reason: string;
  severity: Severity;
}

export interface ExtractedField {
  value: string;
  confidence: number;
}

export interface DocumentAnalysisResult {
  label: DocumentLabel;
  score: number;
  findings: DocumentFinding[];
  extractedFields: Record<string, ExtractedField>;
  model_version: string;
}

export interface AudioAnalysisResult {
  label: AudioLabel;
  score: number;
  reasons: string[];
  transcript?: string;
  model_version: string;
}

export interface HistoryItem {
  id: string;
  created_at: string;
  modality: Modality;
  score: number;
  label: string;
  summary?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, any>;
}
