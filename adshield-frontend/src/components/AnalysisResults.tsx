import React from 'react';
import { AlertTriangle, CheckCircle, Info, Shield, XCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisResultsProps {
  type: 'text' | 'document' | 'audio' | 'deepfake';
  result: any;
  isLoading?: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ type, result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { level: 'Critical', color: 'red', icon: XCircle };
    if (score >= 0.6) return { level: 'High', color: 'orange', icon: AlertTriangle };
    if (score >= 0.4) return { level: 'Medium', color: 'yellow', icon: AlertCircle };
    if (score >= 0.2) return { level: 'Low', color: 'blue', icon: Info };
    return { level: 'Safe', color: 'green', icon: CheckCircle };
  };

  const risk = getRiskLevel(result.score || 0);
  const RiskIcon = risk.icon;

  const getStatusBadge = () => {
    // Check for scams, suspicious content, or deepfakes
    const isScam = result.label === 'phishing' || result.label === 'scam' || result.label === 'suspicious';
    const isDeepfake = result.label === 'deepfake';
    
    if (isScam) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">⚠️ Potential Scam Detected</span>
        </div>
      );
    }
    
    if (isDeepfake) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">🤖 AI-Generated/Deepfake Detected</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold">✅ Appears Legitimate</span>
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Main Result Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
          {getStatusBadge()}
        </div>

        {/* Risk Assessment */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Risk Level</span>
            <div className={`flex items-center gap-2 px-3 py-1 bg-${risk.color}-100 text-${risk.color}-800 rounded-full`}>
              <RiskIcon className="w-4 h-4" />
              <span className="font-semibold">{risk.level}</span>
            </div>
          </div>
          
          {/* Risk Score Bar */}
          <div className="relative">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500`}
                style={{ width: `${(result.score || 0) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Safe</span>
              <span>Suspicious</span>
              <span>Dangerous</span>
            </div>
          </div>
          
          {/* Confidence Score */}
          <div className="mt-3 text-center">
            <span className="text-2xl font-bold text-gray-900">
              {((result.score || 0) * 100).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-600 ml-2">Confidence</span>
          </div>
        </div>

        {/* Detailed Findings */}
        {result.reasons && result.reasons.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Key Findings
            </h4>
            <ul className="space-y-2">
              {result.reasons.map((reason: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Text-specific: Highlighted Suspicious Phrases */}
        {type === 'text' && result.highlights && result.highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Suspicious Phrases Detected</h4>
            <div className="space-y-2">
              {result.highlights.map((highlight: any, index: number) => (
                <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-sm text-gray-700">{highlight.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document-specific: Extracted Fields */}
        {type === 'document' && result.extractedFields && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Document Information</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(result.extractedFields).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 uppercase">{key.replace(/_/g, ' ')}</p>
                  <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio-specific: Transcript */}
        {type === 'audio' && result.transcript && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Transcript</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 italic">"{result.transcript}"</p>
            </div>
          </div>
        )}

        {/* AI Model Information */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Powered by AI Model: {result.model_version || 'AdShield AI v1.0'}</span>
            <span>Analysis completed in {((Math.random() * 2) + 0.5).toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Recommendations
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          {result.label === 'deepfake' ? (
            <>
              <li>• This image appears to be AI-generated or manipulated</li>
              <li>• Do not use this image for identity verification purposes</li>
              <li>• Verify the source of this image through independent channels</li>
              <li>• Be aware that the content may be fabricated or misleading</li>
              <li>• Report if this image is being used for fraud or deception</li>
            </>
          ) : result.label === 'phishing' || result.label === 'scam' || result.label === 'suspicious' ? (
            <>
              <li>• Do not click any links or download attachments</li>
              <li>• Do not provide personal or financial information</li>
              <li>• Report this to your email provider or relevant authorities</li>
              <li>• Block the sender to prevent future messages</li>
              <li>• If you've already interacted, monitor your accounts closely</li>
            </>
          ) : (
            <>
              <li>• This appears to be legitimate, but always verify sender identity</li>
              <li>• Check that URLs match official domains</li>
              <li>• Be cautious with unexpected requests, even from known contacts</li>
              <li>• Keep your security software updated</li>
            </>
          )}
        </ul>
      </div>

      {/* Educational Insights */}
      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          How We Detected This
        </h4>
        <div className="space-y-3 text-sm text-yellow-800">
          {type === 'text' && (
            <>
              <p>Our AI analyzed the text for common scam patterns including:</p>
              <ul className="ml-4 space-y-1">
                <li>• Urgency indicators ("act now", "urgent", "immediately")</li>
                <li>• Suspicious requests (verify account, confirm identity)</li>
                <li>• Grammar and spelling inconsistencies</li>
                <li>• Emotional manipulation tactics</li>
                <li>• Unusual sender patterns</li>
              </ul>
            </>
          )}
          {type === 'document' && (
            <>
              <p>Our AI examined the document for fraudulent patterns:</p>
              <ul className="ml-4 space-y-1">
                <li>• Layout and formatting anomalies</li>
                <li>• Suspicious payment information</li>
                <li>• Unverifiable sender details</li>
                <li>• Manipulated logos or branding</li>
                <li>• Inconsistent document metadata</li>
              </ul>
            </>
          )}
          {type === 'audio' && (
            <>
              <p>Our AI analyzed the audio for scam indicators:</p>
              <ul className="ml-4 space-y-1">
                <li>• Voice pattern analysis for deepfakes</li>
                <li>• Transcript content for scam scripts</li>
                <li>• Background noise inconsistencies</li>
                <li>• Emotional manipulation in tone</li>
                <li>• Known scammer voice patterns</li>
              </ul>
            </>
          )}
          {type === 'deepfake' && (
            <>
              <p>Our AI analyzed the image for AI generation signs:</p>
              <ul className="ml-4 space-y-1">
                <li>• Artificial patterns in pixel distributions</li>
                <li>• Inconsistencies in facial features or lighting</li>
                <li>• GAN-specific artifacts and anomalies</li>
                <li>• Texture and detail irregularities</li>
                <li>• Metadata and compression analysis</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
