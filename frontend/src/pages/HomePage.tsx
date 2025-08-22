import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, FileCheck, Camera, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Header } from '../components/layout/Header';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-12 pb-8 sm:pt-20 sm:pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
            AI-Powered Protection
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Protect Yourself from
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Text Scams in Seconds</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Advanced AI text analysis for phishing & scam detection - works perfectly on free hosting!
            <br />
            <span className="text-sm text-gray-500">(Image & document features require premium APIs)</span>
          </p>
        </section>

        {/* Analysis Types */}
        <section className="pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Text Analysis */}
            <div
              onClick={() => navigate('/analyze/text')}
              className="bg-white p-6 rounded-xl border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Text Analysis</h3>
              <p className="text-sm text-blue-600 font-medium mb-3">Phishing detection</p>
              <p className="text-sm text-gray-600 mb-4">
                Identify suspicious emails, SMS, and messages with AI-powered analysis
              </p>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-semibold">✨ Fully Working</span>
              </div>
            </div>

            {/* Document Verify */}
            <div
              onClick={() => navigate('/analyze/document')}
              className="bg-white p-6 rounded-xl border border-green-100 hover:shadow-xl hover:border-green-200 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Document Verify</h3>
              <p className="text-sm text-green-600 font-medium mb-3">OCR text extraction</p>
              <p className="text-sm text-gray-600 mb-4">
                Extract text from documents (requires paid OCR API for production)
              </p>
              <div className="flex items-center text-yellow-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Demo Mode</span>
              </div>
            </div>

            {/* Image Deepfake */}
            <div
              onClick={() => navigate('/analyze/deepfake')}
              className="bg-white p-6 rounded-xl border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Deepfake Detection</h3>
              <p className="text-sm text-purple-600 font-medium mb-3">AI-generated image detection</p>
              <p className="text-sm text-gray-600 mb-4">
                Detect AI-generated images (basic detection in free tier)
              </p>
              <div className="flex items-center text-yellow-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Limited</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl my-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">95%+</div>
              <div className="text-sm text-gray-600 font-medium">Text Accuracy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">&lt;2s</div>
              <div className="text-sm text-gray-600 font-medium">Analysis Time</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">3</div>
              <div className="text-sm text-gray-600 font-medium">Detection Modes</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-gray-600 font-medium">Privacy First</div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-12 border-t">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Recent Scans */}
            <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Recent Scans</h3>
              </div>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent scans yet</p>
                <p className="text-xs text-gray-400 mt-2">
                  Start by selecting an analysis type above
                </p>
              </div>
            </div>

            {/* Security Overview */}
            <div className="bg-white p-6 rounded-xl border border-green-100 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Security Overview</h3>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold rounded-full shadow-sm">
                  Protected
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Threats Blocked</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Files Analyzed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Protection Level</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
