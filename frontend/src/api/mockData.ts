import type { TextAnalysisResult, DocumentAnalysisResult, AudioAnalysisResult } from '../types/api';

// Mock data for development
export const mockTextAnalysisResult: TextAnalysisResult = {
  label: 'phishing',
  score: 0.85,
  highlights: [
    {
      start: 12,
      end: 26,
      reason: 'Urgency cue: "urgent action"',
      severity: 'high'
    },
    {
      start: 58,
      end: 81,
      reason: 'Suspicious URL detected',
      severity: 'medium'
    }
  ],
  reasons: [
    'Multiple urgency cues detected',
    'Suspicious link domain',
    'Grammar inconsistencies typical of phishing'
  ],
  model_version: 'distilbert-phishing@2025-08-01'
};

export const mockDocumentAnalysisResult: DocumentAnalysisResult = {
  label: 'suspicious',
  score: 0.95,
  findings: [
    {
      bbox: [120, 240, 180, 60],
      page: 1,
      reason: 'Logo mismatch detected',
      severity: 'high'
    },
    {
      bbox: [80, 520, 300, 40],
      page: 1,
      reason: 'Font inconsistency',
      severity: 'medium'
    }
  ],
  extractedFields: {
    issuer: {
      value: 'Bank of Example',
      confidence: 0.92
    },
    accountNumber: {
      value: '****1234',
      confidence: 0.88
    }
  },
  model_version: 'donut-docvqa@2025-08-01'
};

export const mockAudioAnalysisResult: AudioAnalysisResult = {
  label: 'deepfake',
  score: 0.78,
  reasons: [
    'Synthetic speech artifacts detected',
    'Unnatural prosody patterns',
    'Voice print inconsistencies'
  ],
  model_version: 'wav2vec-anti-deepfake@2025-08-01'
};

// Simulate API delay
export const simulateDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));
