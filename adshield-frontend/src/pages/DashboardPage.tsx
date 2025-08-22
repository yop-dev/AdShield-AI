import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FileImage, Mic } from 'lucide-react';
import { Card } from '../components/shared/Card';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const analysisOptions = [
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: 'Text Analysis',
      description: 'Analyze emails, messages, and text for phishing attempts',
      path: '/analyze/text'
    },
    {
      icon: <FileImage className="h-12 w-12 text-primary" />,
      title: 'Document Analysis',
      description: 'Verify authenticity of documents and images',
      path: '/analyze/document'
    },
    {
      icon: <Mic className="h-12 w-12 text-primary" />,
      title: 'Audio Analysis',
      description: 'Detect deepfakes and synthetic speech',
      path: '/analyze/audio'
    }
  ];
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Analysis Type</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {analysisOptions.map((option, index) => (
            <Card
              key={index}
              hoverable
              onClick={() => navigate(option.path)}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                {option.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-gray-600">
                {option.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Scans</h2>
          <Card>
            <p className="text-gray-600">No recent scans yet. Start by selecting an analysis type above.</p>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <Card>
            <p className="text-gray-600">Statistics will appear here after your first analysis.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
