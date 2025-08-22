import React, { useState, useRef } from 'react';
import AnalysisResults from '../components/AnalysisResults';
import { analyzeAudio } from '../services/analysisService';
import type { AudioAnalysisResponse } from '../services/analysisService';

interface AnalysisResult {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  scam_type?: string;
  indicators: string[];
  explanations: string[];
  recommendations: string[];
  audio_metadata?: {
    duration: string;
    format: string;
    transcript?: string;
    voice_characteristics?: string[];
  };
  model_version?: string;
}

// Helper to convert API response to UI format
const convertApiResponse = (response: AudioAnalysisResponse, file: File): AnalysisResult => {
  // Parse voice characteristics from reasons if available
  const voiceCharacteristics = response.reasons?.filter(r => 
    r.toLowerCase().includes('voice') || 
    r.toLowerCase().includes('audio') ||
    r.toLowerCase().includes('deepfake')
  ) || [];
  
  return {
    risk_score: response.score,
    risk_level: response.risk_level || 'low',
    scam_type: response.scam_type,
    indicators: response.reasons || [],
    explanations: response.reasons || [],
    recommendations: response.recommendations || [],
    audio_metadata: {
      duration: 'N/A', // Backend would need to provide this
      format: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      transcript: response.transcript,
      voice_characteristics: voiceCharacteristics.length > 0 ? voiceCharacteristics : undefined
    },
    model_version: response.model_version
  };
};

export const AudioAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/mp3'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
      setError('Please upload an audio file (MP3, WAV, M4A, OGG, WebM)');
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
      setError('Please select an audio file to analyze');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      // Call real API
      const apiResponse = await analyzeAudio(selectedFile);
      const analysisResult = convertApiResponse(apiResponse, selectedFile);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze audio. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audio Analysis</h1>
        <p className="text-gray-600">
          Upload audio recordings to detect voice phishing (vishing) and phone scams
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Audio File
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
              id="audio-upload"
              className="sr-only"
              onChange={handleChange}
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
              disabled={isAnalyzing}
            />
            
            {selectedFile ? (
              <div className="space-y-3">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <div className="text-gray-900 font-medium">{selectedFile.name}</div>
                <div className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</div>
                
                {/* Audio Player Preview */}
                <div className="mt-4 mx-auto max-w-sm">
                  <audio
                    ref={audioRef}
                    controls
                    className="w-full"
                    src={URL.createObjectURL(selectedFile)}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
                
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop your audio file here or <span className="text-blue-600 hover:text-blue-700">browse</span>
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  MP3, WAV, M4A, OGG, WebM up to 50MB
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
                Analyzing Audio...
              </span>
            ) : (
              'Analyze Audio'
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
        type="audio" 
        result={result ? {
          ...result,
          label: result.risk_level === 'high' ? 'scam' : 'real',
          score: result.risk_score,
          reasons: result.explanations,
          transcript: result.audio_metadata?.transcript,
          model_version: result.model_version
        } : null} 
        isLoading={isAnalyzing} 
      />
    </div>
  );
};
