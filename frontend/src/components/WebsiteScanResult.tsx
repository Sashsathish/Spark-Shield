import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Globe,
  Clock,
  AlertCircle,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  InfoIcon,
  XCircle,
} from 'lucide-react';
import { ScanDetails } from './ScanDetails';
import { motion } from 'framer-motion';

const WebsiteScanResult = ({ websiteScanData }: any) => {
  // Helper function to validate domain
  const isValidDomain = (domain: string): boolean => {
    const domainRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return domainRegex.test(domain);
  };

  // Risk determination functions
  const determineUrlRisk = (domain: string): 'safe' | 'warning' | 'danger' => {
    if (!isValidDomain(domain)) return 'danger';
    return 'safe';
  };

  const determineLegitimacyRisk = (
    score: number
  ): 'safe' | 'warning' | 'danger' => {
    if (score >= 80) return 'safe';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const determinePhishingRisk = (
    riskLevel: string
  ): 'safe' | 'warning' | 'danger' => {
    const lowRiskTerms = ['low', 'minimal', 'none'];
    const mediumRiskTerms = ['medium', 'moderate'];
    const normalizedRiskLevel = riskLevel.toLowerCase();
    if (lowRiskTerms.some((term) => normalizedRiskLevel.includes(term)))
      return 'safe';
    if (mediumRiskTerms.some((term) => normalizedRiskLevel.includes(term)))
      return 'warning';
    return 'danger';
  };

  // Dynamic scan details
  const scanDetails = [
    {
      label: 'URL',
      value: websiteScanData.domain_name,
      icon: <Globe size={18} />,
      risk: determineUrlRisk(websiteScanData.domain_name),
    },
    {
      label: 'Scan Time',
      value: new Date().toLocaleString(),
      icon: <Clock size={18} />,
    },
    {
      label: 'Legitimacy Score',
      value: `${websiteScanData.legitimacy_score}%`,
      icon: <Shield size={18} />,
      risk: determineLegitimacyRisk(websiteScanData.legitimacy_score),
    },
    {
      label: 'Phishing Risk',
      value: websiteScanData.phishing_risk_level,
      icon: <AlertCircle size={18} />,
      risk: determinePhishingRisk(websiteScanData.phishing_risk_level),
    },
  ];

  // Legitimacy score UI logic
  const legitimacyScore = websiteScanData.legitimacy_score;
  let scoreColorClass = 'text-teal-500';
  let scoreIcon = <Check size={16} />;
  let scoreBgClass = 'bg-teal-500/10';
  let scoreLabel = 'Verified Legitimate';

  if (legitimacyScore < 50) {
    scoreColorClass = 'text-red-500';
    scoreIcon = <AlertTriangle size={16} />;
    scoreBgClass = 'bg-red-500/10';
    scoreLabel = 'Potentially Malicious';
  } else if (legitimacyScore < 80) {
    scoreColorClass = 'text-amber-500';
    scoreIcon = <AlertTriangle size={16} />;
    scoreBgClass = 'bg-amber-500/10';
    scoreLabel = 'Exercise Caution';
  }
  const determineResult = () => {
    if (legitimacyScore < 50) return 'malicious';
    if (legitimacyScore < 80) return 'suspicious';
    return 'clean';
  };

  const result = determineResult();

  const getResultUI = () => {
    switch (determineResult()) {
      case 'clean':
        return {
          title: 'No Threats Detected',
          description: `This website appears to be safe. No significant risks were detected.`,
          icon: <CheckCircle size={32} className="text-teal-500" />,
          color: 'text-teal-500',
          bgColor: 'bg-teal-900/30',
          borderColor: 'border-teal-500/20',
        };
      case 'suspicious':
        return {
          title: 'Suspicious Website Detected',
          description: `This website was flagged as suspicious. Exercise caution when interacting with it.`,
          icon: <AlertTriangle size={32} className="text-yellow-500" />,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-900/30',
          borderColor: 'border-yellow-500/20',
        };
      case 'malicious':
        return {
          title: 'Potentially Malicious Website Detected',
          description: `This website was identified as potentially malicious. Avoid interacting with it.`,
          icon: <XCircle size={32} className="text-red-500" />,
          color: 'text-red-500',
          bgColor: 'bg-red-900/30',
          borderColor: 'border-red-500/20',
        };
      default:
        return {
          title: 'Scan Completed',
          description: 'Scan results for this website are available.',
          icon: <Info size={32} className="text-blue-500" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-900/30',
          borderColor: 'border-blue-500/20',
        };
    }
  };

  const resultUI = getResultUI();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 200,
            damping: 10,
          }}
          className={`w-20 h-20 rounded-full ${resultUI?.bgColor} ${resultUI.color} flex items-center justify-center mb-4 mx-auto border ${resultUI.borderColor}`}
        >
          {resultUI.icon}
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{resultUI.title}</h2>
        <p className="text-spark-gray-300 max-w-md mx-auto">
          {resultUI.description}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="animate-fade-in">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="overview" className="tab-button">
            Overview
          </TabsTrigger>
          <TabsTrigger value="verified-elements" className="tab-button">
            Verified Elements
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="tab-button">
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <ScanDetails title="Scan Details" items={scanDetails} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legitimacy Score Card */}
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-medium">Legitimacy Score</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray={`${legitimacyScore}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">
                        {legitimacyScore}%
                      </span>
                      <span className="text-xs text-white/60">Legitimacy</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg ${scoreBgClass} ${scoreColorClass} text-sm`}
                  >
                    {scoreIcon}
                    <span>{scoreLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Analysis Card */}
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-medium">Full Analysis</h3>
              </div>
              <div className="p-6">
                <p className="text-white/70 leading-relaxed">
                  {websiteScanData.full_analysis}
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Info size={16} className="text-white/60" />
                    Phishing Risk Level
                  </div>
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-teal-500/10 text-teal-500 text-sm">
                    <Shield size={14} />
                    <span>{websiteScanData.phishing_risk_level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Verified Elements Tab */}
        <TabsContent value="verified-elements" className="mt-6">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-medium">Verified Elements</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {websiteScanData.verified_elements.length > 0 ? (
                  websiteScanData.verified_elements.map((element, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="p-1 rounded-full bg-teal-500/10 text-teal-500">
                        <Check size={14} />
                      </div>
                      <span className="text-sm text-white/80">{element}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg border border-white/10 bg-teal-500/5">
                    <div className="flex items-center gap-2 font-medium text-teal-500">
                      <Shield size={16} />
                      No Verified Elements Found
                    </div>
                  </div>
                )}
              </div>

              {/* Red Flags Section */}
              {websiteScanData.red_flags.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                    <AlertTriangle size={16} className="text-amber-500" />
                    Red Flags
                  </div>
                  <div className="space-y-3">
                    {websiteScanData.red_flags.map((flag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div className="p-1 rounded-full bg-amber-500/10 text-amber-500">
                          <AlertTriangle size={14} />
                        </div>
                        <span className="text-sm text-white/80">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6">
          <div className="glass-card p-6">
            <p className="text-white/70 leading-relaxed">
              Based on our analysis, here are some recommended actions:
            </p>
            <ul className="mt-4 space-y-3 text-white/70">
              {websiteScanData.suggested_actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-teal-500/10 text-teal-500 mt-0.5">
                    <Shield size={14} />
                  </div>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteScanResult;
