import React from 'react';

interface RiskMeterProps {
  score: number; // 0-1
  label?: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, label }) => {
  const percentage = Math.round(score * 100);
  const getRiskLevel = () => {
    if (score < 0.3) return { text: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (score < 0.6) return { text: 'Medium Risk', color: 'text-amber-600', bgColor: 'bg-amber-500' };
    return { text: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-500' };
  };
  
  const risk = getRiskLevel();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Risk Score</span>
        <span className={`text-sm font-bold ${risk.color}`}>
          {percentage}% - {label || risk.text}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full ${risk.bgColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
