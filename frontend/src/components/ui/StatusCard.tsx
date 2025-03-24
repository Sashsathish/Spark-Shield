import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface StatusCardProps {
  type: 'harmless' | 'suspicious' | 'malicious' | 'undetected' | 'timeout';
  count: number;
  delay?: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  type,
  count,
  delay = 0,
}) => {
  let icon, label, textClass;

  switch (type) {
    case 'harmless':
      icon = <CheckCircle size={18} />;
      label = 'Safe';
      textClass = 'text-teal-500';
      break;
    case 'suspicious':
      icon = <AlertTriangle size={18} />;
      label = 'Suspicious';
      textClass = 'text-yellow-500';
      break;
    case 'malicious':
      icon = <XCircle size={18} />;
      label = 'Malicious';
      textClass = 'text-red-500';
      break;
    case 'undetected':
      icon = <HelpCircle size={18} />;
      label = 'Undetected';
      textClass = 'text-gray-400';
      break;
    case 'timeout':
      icon = <Clock size={18} />;
      label = 'Timeout';
      textClass = 'text-gray-400';
      break;
  }

  return (
    <div
      className="glass-card p-4 flex flex-col items-center justify-center gap-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mt-1 ${textClass}`}>{icon}</div>
      <div className="text-xl font-semibold mt-1 text-white">{count}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};
