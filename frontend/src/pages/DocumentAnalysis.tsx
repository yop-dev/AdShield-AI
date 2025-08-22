import React, { useState } from 'react';
import AnalysisResults from '../components/AnalysisResults';
import { analyzeDocument } from '../services/analysisService';
import type { DocumentAnalysisResponse } from '../services/analysisService';

interface AnalysisResult {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  scam_type?: string;
  indicators: string[];
  explanations: string[];
  recommendations: string[];
  document_metadata?: {
    file_type: string;
    pages?: number;
    suspicious_elements?: string[];
    extracted_fields?: Record<string, any>;
    findings?: Array<{
      bbox: { x: number; y: number; width: number; height: number };
      reason: string;
    }>;
  };
  model_version?: string;
}

// Helper to convert API response to UI format
const convertApiResponse = (response: DocumentAnalysisResponse, file: File): AnalysisResult => {
  // Get suspicious elements from findings
  const suspiciousElements = response.findings?.map(f => f.reason) || [];
  
  return {
    risk_score: response.score,
    risk_level: response.risk_level || 'low',
    scam_type: response.scam_type,
    indicators: suspiciousElements,
    explanations: response.findings?.map(f => f.reason) || [],
    recommendations: response.recommendations || [],
    document_metadata: {
      file_type: file.type.split('/')[1]?.toUpperCase() || 'Unknown',
      pages: 1, // Can be extracted from response if backend provides it
      suspicious_elements: suspiciousElements,
      extracted_fields: response.extractedFields,
      findings: response.findings
    },
    model_version: response.model_version
  };
};

export const DocumentAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, image (JPEG, PNG, GIF), or Word document');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    setResult(null);
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
      setError('Please select a document to analyze');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      // Call real API
      const apiResponse = await analyzeDocument(selectedFile);
      const analysisResult = convertApiResponse(apiResponse, selectedFile);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };


  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Analysis</h1>
        <p className="text-gray-600">
          Upload documents to check for fake invoices, contracts, or fraudulent paperwork
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Document
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
              disabled={isAnalyzing}
            />
            
            {selectedFile ? (
              <div className="space-y-3">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-gray-900 font-medium">{selectedFile.name}</div>
                <div className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</div>
                <button
                  onClick={handleClear}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop your document here or <span className="text-blue-600 hover:text-blue-700">browse</span>
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, Images (JPEG, PNG, GIF), Word documents up to 10MB
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
              'Analyze Document'
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

      {/* Enhanced Detailed Analysis Results */}
      <AnalysisResults 
        type="document" 
        result={result ? {
          ...result,
          label: result.risk_level === 'high' ? 'suspicious' : 'legit',
          score: result.risk_score,
          reasons: result.explanations,
          extractedFields: result.document_metadata?.extracted_fields,
          findings: result.document_metadata?.findings,
          model_version: result.model_version
        } : null} 
        isLoading={isAnalyzing} 
      />
    </div>
  );
};
