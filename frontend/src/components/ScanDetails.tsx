import React from 'react';
import {
  File,
  Globe,
  Clock,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface ScanDetailsItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  risk?: 'safe' | 'warning' | 'danger';
}

const ScanDetailsItem: React.FC<ScanDetailsItemProps> = ({
  label,
  value,
  icon,
  risk,
}) => {
  let riskBadge = null;

  if (risk) {
    let badgeClass = '';
    let badgeIcon = null;

    switch (risk) {
      case 'safe':
        badgeClass = 'bg-teal-500/10 text-teal-500';
        badgeIcon = <ShieldCheck size={14} />;
        break;
      case 'warning':
        badgeClass = 'bg-amber-500/10 text-amber-500';
        badgeIcon = <AlertTriangle size={14} />;
        break;
      case 'danger':
        badgeClass = 'bg-red-500/10 text-red-500';
        badgeIcon = <XCircle size={14} />;
        break;
    }

    riskBadge = (
      <div
        className={`px-2 py-0.5 rounded flex items-center gap-1 text-xs ${badgeClass}`}
      >
        {badgeIcon}
        <span>
          {risk === 'safe'
            ? 'Safe'
            : risk === 'warning'
            ? 'Suspicious'
            : 'Malicious'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        {icon && <div className="text-white/40">{icon}</div>}
        <span className="text-white/60">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium">{value}</span>
        {riskBadge}
      </div>
    </div>
  );
};

interface ScanDetailsProps {
  title: string;
  items: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    risk?: 'safe' | 'warning' | 'danger';
  }[];
}

export const ScanDetails: React.FC<ScanDetailsProps> = ({ title, items }) => {
  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
        <File size={18} className="text-white/60" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-6">
        {items.map((item, index) => (
          <ScanDetailsItem
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
            risk={item.risk}
          />
        ))}
      </div>
    </div>
  );
};
