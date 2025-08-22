import React, { useState } from 'react';
import AnalysisResults from '../components/AnalysisResults';
import { analyzeDeepfake } from '../services/analysisService';

interface AnalysisResult {
  is_deepfake: boolean;
  confidence: number;
  label: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  explanations: string[];
  recommendations: string[];
  details: any;
  model_version?: string;
}

export const DeepfakeAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    setResult(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image to analyze');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      // Call the deepfake detection API
      const apiResponse = await analyzeDeepfake(selectedFile);
      setResult(apiResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setImagePreview(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deepfake Detection</h1>
        <p className="text-gray-600">
          Upload an image to detect if it's AI-generated or manipulated
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image-upload"
              className="sr-only"
              onChange={handleChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              disabled={isAnalyzing}
            />
            
            {selectedFile ? (
              <div className="space-y-3">
                {imagePreview && (
                  <div className="mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto max-h-64 rounded-lg shadow-md"
                    />
                  </div>
                )}
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-gray-900 font-medium">{selectedFile.name}</div>
                <div className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</div>
                <button
                  onClick={handleClear}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Choose a different image
                </button>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop your image here or <span className="text-purple-600 hover:text-purple-700">browse</span>
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  JPEG, PNG, GIF, or WebP up to 10MB
                </p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedFile}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
              'Analyze Image'
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={isAnalyzing || !selectedFile}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      <AnalysisResults 
        type="deepfake" 
        result={result ? {
          label: result.is_deepfake ? 'deepfake' : 'authentic',
          score: result.confidence,
          risk_score: result.risk_score,
          risk_level: result.risk_level,
          reasons: result.explanations,
          recommendations: result.recommendations,
          model_version: result.model_version,
          details: result.details
        } : null} 
        isLoading={isAnalyzing} 
      />
    </div>
  );
};
