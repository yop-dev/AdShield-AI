import apiClient from './api.config';

// Types matching the PRD API specifications
export interface TextAnalysisRequest {
  text: string;
}

export interface TextAnalysisResponse {
  label: 'phishing' | 'legit';
  score: number; // 0..1
  highlights: Array<{
    start: number;
    end: number;
    reason: string;
  }>;
  reasons: string[];
  model_version: string;
  risk_level?: 'low' | 'medium' | 'high'; // Added for UI compatibility
  scam_type?: string; // Added for detailed classification
  recommendations?: string[]; // Added for user guidance
}

export interface DocumentAnalysisResponse {
  label: 'suspicious' | 'legit';
  score: number;
  findings: Array<{
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    reason: string;
  }>;
  extractedFields: Record<string, any>;
  model_version: string;
  risk_level?: 'low' | 'medium' | 'high';
  scam_type?: string;
  recommendations?: string[];
}

export interface AudioAnalysisResponse {
  label: 'deepfake' | 'real' | 'scam';
  score: number;
  reasons: string[];
  model_version: string;
  transcript?: string; // Optional transcript
  risk_level?: 'low' | 'medium' | 'high';
  scam_type?: string;
  recommendations?: string[];
}

export interface DeepfakeAnalysisResponse {
  is_deepfake: boolean;
  confidence: number;
  label: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  explanations: string[];
  recommendations: string[];
  details: any;
  model_version?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  created_at: string;
  text_score?: number;
  doc_score?: number;
  audio_score?: number;
  findings_json?: any;
  meta_json?: any;
}

// Helper function to determine risk level from score
const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 0.3) return 'low';
  if (score < 0.7) return 'medium';
  return 'high';
};

// Helper function to generate recommendations based on score
const getRecommendations = (score: number): string[] => {
  if (score < 0.3) {
    return ['Content appears safe', 'Continue to verify sender identity when in doubt'];
  }
  if (score < 0.7) {
    return [
      'Exercise caution with this content',
      'Verify the sender through official channels',
      'Do not click suspicious links or provide personal information'
    ];
  }
  return [
    'High risk detected - do not interact with this content',
    'Report this as spam or phishing',
    'Delete this message immediately',
    'If you\'ve already interacted, change your passwords and monitor accounts'
  ];
};

// Text Analysis API
export const analyzeText = async (text: string): Promise<TextAnalysisResponse> => {
  try {
    const response = await apiClient.post<TextAnalysisResponse>('/api/v1/text/analyze', {
      text
    });
    
    // Enhance response with UI-friendly fields
    const data = response.data;
    data.risk_level = getRiskLevel(data.score);
    
    // Map label to scam type
    if (data.label === 'phishing') {
      data.scam_type = 'Phishing Attempt';
    }
    
    // Add recommendations if not provided by backend
    if (!data.recommendations) {
      data.recommendations = getRecommendations(data.score);
    }
    
    return data;
  } catch (error: any) {
    console.error('Text analysis error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to analyze text');
  }
};

// Document Analysis API
export const analyzeDocument = async (file: File, question?: string): Promise<DocumentAnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (question) {
      formData.append('question', question);
    }
    
    const response = await apiClient.post<DocumentAnalysisResponse>(
      '/api/v1/doc/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Enhance response
    const data = response.data;
    data.risk_level = getRiskLevel(data.score);
    
    if (data.label === 'suspicious') {
      // Determine scam type based on extracted fields or findings
      const extractedText = JSON.stringify(data.extractedFields).toLowerCase();
      if (extractedText.includes('invoice') || extractedText.includes('payment')) {
        data.scam_type = 'Fake Invoice Scam';
      } else if (extractedText.includes('contract')) {
        data.scam_type = 'Fraudulent Contract';
      } else {
        data.scam_type = 'Suspicious Document';
      }
    }
    
    if (!data.recommendations) {
      data.recommendations = getRecommendations(data.score);
    }
    
    return data;
  } catch (error: any) {
    console.error('Document analysis error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to analyze document');
  }
};

// Deepfake Image Analysis API
export const analyzeDeepfake = async (file: File): Promise<DeepfakeAnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<DeepfakeAnalysisResponse>(
      '/api/v1/deepfake/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10 seconds for image processing
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Deepfake analysis error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to analyze image for deepfakes');
  }
};

// Audio Analysis API
export const analyzeAudio = async (file: File): Promise<AudioAnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<AudioAnalysisResponse>(
      '/api/v1/audio/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10 seconds for audio processing
      }
    );
    
    // Enhance response
    const data = response.data;
    data.risk_level = getRiskLevel(data.score);
    
    if (data.label === 'deepfake' || data.label === 'scam') {
      data.scam_type = data.label === 'deepfake' ? 'Deepfake Audio' : 'Voice Phishing (Vishing)';
    }
    
    if (!data.recommendations) {
      data.recommendations = getRecommendations(data.score);
    }
    
    return data;
  } catch (error: any) {
    console.error('Audio analysis error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to analyze audio');
  }
};

// History API (optional)
export const saveToHistory = async (summary: any): Promise<{ id: string }> => {
  try {
    const response = await apiClient.post<{ id: string }>('/api/v1/history', {
      summary
    });
    return response.data;
  } catch (error: any) {
    console.error('Save to history error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to save to history');
  }
};

export const getHistory = async (limit: number = 10, offset: number = 0): Promise<HistoryItem[]> => {
  try {
    const response = await apiClient.get<HistoryItem[]>('/api/v1/history', {
      params: { limit, offset }
    });
    return response.data;
  } catch (error: any) {
    console.error('Get history error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch history');
  }
};

// Combined analysis (optional aggregator endpoint)
export const analyzeMultiple = async (data: {
  text?: string;
  document?: File;
  audio?: File;
}): Promise<any> => {
  try {
    const formData = new FormData();
    if (data.text) {
      formData.append('text', data.text);
    }
    if (data.document) {
      formData.append('document', data.document);
    }
    if (data.audio) {
      formData.append('audio', data.audio);
    }
    
    const response = await apiClient.post('/api/v1/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Multiple analysis error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to perform analysis');
  }
};
