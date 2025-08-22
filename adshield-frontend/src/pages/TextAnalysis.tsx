import React, { useState } from 'react';
import { analyzeText } from '../services/analysisService';
import type { TextAnalysisResponse } from '../services/analysisService';
import AnalysisResults from '../components/AnalysisResults';
import { apiClient } from '../services/api.config';

interface AnalysisResult {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  scam_type?: string;
  indicators: string[];
  explanations: string[];
  recommendations: string[];
  highlights?: Array<{
    start: number;
    end: number;
    reason: string;
  }>;
  model_version?: string;
}

// Helper to convert API response to UI format
const convertApiResponse = (response: TextAnalysisResponse): AnalysisResult => {
  return {
    risk_score: response.score,
    risk_level: response.risk_level || 'low',
    scam_type: response.scam_type,
    indicators: response.highlights?.map((h: any) => h.reason) || [],
    explanations: response.reasons || [],
    recommendations: response.recommendations || [],
    highlights: response.highlights,
    model_version: response.model_version
  };
};

export const TextAnalysis: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      // Call real API
      const apiResponse = await analyzeText(inputText);
      console.log('API Response:', apiResponse); // Debug log
      const analysisResult = convertApiResponse(apiResponse);
      console.log('Converted Result:', analysisResult); // Debug log
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
    setImagePreview(null);
  };

  const handleImageUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Extract text from image
    await extractTextFromImage(file);
  };

  const extractTextFromImage = async (file: File) => {
    setIsExtractingText(true);
    setError(null);
    
    try {
      // Call backend OCR endpoint
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/api/v1/text/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.text) {
        // Check if it's the demo/fallback message from backend
        if (response.data.text.includes('[OCR Demo Mode') || response.data.text.includes('[Text extraction')) {
          // It's demo text - still set it but show a notice
          setInputText(response.data.text);
          setError('📝 OCR is in demo mode. The text shown is a sample. You can clear it and type your own text for real analysis.');
        } else {
          // Real OCR text extracted
          setInputText(response.data.text);
          // Show success message briefly
          setError('✅ Text extracted successfully!');
          setTimeout(() => setError(null), 3000);
        }
      } else {
        setError('No text found in the image');
      }
    } catch (err: any) {
      console.error('OCR error:', err);
      setError('Failed to extract text from image. Please try typing the text manually.');
    } finally {
      setIsExtractingText(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Analysis</h1>
        <p className="text-gray-600">
          Analyze emails, text messages, or any suspicious text content for potential scams
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Screenshot Upload Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="mb-3">
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Upload a screenshot
                </span>
                <span className="text-sm text-gray-600"> or drag and drop</span>
              </label>
              <input
                id="image-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isExtractingText || isAnalyzing}
              />
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF or WebP up to 5MB - OCR will attempt to extract text
            </p>
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Screenshot preview" 
                  className="max-h-48 rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {isExtractingText && (
                <div className="mt-2 text-sm text-blue-600">
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting text from image...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
            Text to Analyze
          </label>
          <textarea
            id="text-input"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
            placeholder="Paste email content, SMS, or any text you want to verify..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAnalyzing}
          />
          <div className="mt-2 text-sm text-gray-500">
            {inputText.length} / 5000 characters
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Text'
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={isAnalyzing}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Enhanced Detailed Analysis Results */}
      <AnalysisResults 
        type="text" 
        result={result ? {
          label: result.risk_level === 'high' || result.risk_score > 0.6 ? 'phishing' : 'legit',
          score: result.risk_score,
          highlights: result.highlights,
          reasons: result.explanations,
          model_version: result.model_version,
          scam_type: result.scam_type,
          recommendations: result.recommendations
        } : null} 
        isLoading={isAnalyzing} 
      />
    </div>
  );
};
