import { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  AlertCircle,
  InfoIcon,
  FileText,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DomainAndIPScanResultProps {
  data: any;
  onNewScan?: () => void;
}

const DomainAndIPScanResult = ({
  data,
  onNewScan,
}: DomainAndIPScanResultProps) => {
  console.log(data);
  const [activeTab, setActiveTab] = useState('overview');
  const domainData = data.data;
  const attributes = domainData.attributes;

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const stats = {
    harmless: attributes.last_analysis_stats.harmless || 0,
    suspicious: attributes.last_analysis_stats.suspicious || 0,
    malicious: attributes.last_analysis_stats.malicious || 0,
    undetected: attributes.last_analysis_stats.undetected || 0,
    timeout: attributes.last_analysis_stats.timeout || 0,
  };

  const totalVendors = Object.values(stats).reduce(
    (a: number, b: number) => a + b,
    0
  );

  // Determine the overall result
  const determineResult = () => {
    if (stats.malicious > 0) return 'malicious';
    if (stats.suspicious > 0) return 'suspicious';
    return 'clean';
  };

  const result = determineResult();

  // Get UI elements based on result
  const getResultUI = () => {
    switch (result) {
      case 'clean':
        return {
          title: 'No Threats Detected',
          description: `This url appears to be safe. ${stats.harmless} security vendors confirmed it's harmless.`,
          icon: <CheckCircle size={32} className="text-teal-500" />,
          color: 'text-teal-500',
          bgColor: 'bg-teal-900/30',
          borderColor: 'border-teal-500/20',
        };
      case 'suspicious':
        return {
          title: 'Potentially Suspicious',
          description: `This url was flagged as suspicious by ${stats.suspicious} security vendors.`,
          icon: <AlertTriangle size={32} className="text-yellow-500" />,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-900/30',
          borderColor: 'border-yellow-500/20',
        };
      case 'malicious':
        return {
          title: 'Threat Detected',
          description: `This url was identified as malicious by ${stats.malicious} security vendors.`,
          icon: <XCircle size={32} className="text-red-500" />,
          color: 'text-red-500',
          bgColor: 'bg-red-900/30',
          borderColor: 'border-red-500/20',
        };
      default:
        return {
          title: 'Scan Completed',
          description: 'Scan results for this url are available.',
          icon: <InfoIcon size={32} className="text-blue-500" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-900/30',
          borderColor: 'border-blue-500/20',
        };
    }
  };

  const resultUI = getResultUI();

  // Get remediation advice based on result
  const getRemediationAdvice = () => {
    if (result === 'clean') {
      return 'No action needed. This url is safe to visit.';
    } else if (result === 'suspicious') {
      return 'Exercise caution when visiting this url. Consider additional verification before proceeding.';
    } else {
      return 'Avoid visiting this url. It has been identified as potentially dangerous by multiple security vendors.';
    }
  };

  return (
    <div className="bg-[#12141D] rounded-lg overflow-hidden max-w-3xl mx-auto text-gray-200 border border-gray-800">
      <div className="p-8 text-center">
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

        <div className="grid grid-cols-5 gap-2 mt-10">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-6 h-6 mb-2 text-teal-500" />
            <div className="text-xl font-bold text-white">{stats.harmless}</div>
            <div className="text-xs text-gray-400">Harmless</div>
          </div>

          <div className="flex flex-col items-center">
            <AlertTriangle className="w-6 h-6 mb-2 text-yellow-500" />
            <div className="text-xl font-bold text-white">
              {stats.suspicious}
            </div>
            <div className="text-xs text-gray-400">Suspicious</div>
          </div>

          <div className="flex flex-col items-center">
            <XCircle className="w-6 h-6 mb-2 text-red-500" />
            <div className="text-xl font-bold text-white">
              {stats.malicious}
            </div>
            <div className="text-xs text-gray-400">Malicious</div>
          </div>

          <div className="flex flex-col items-center">
            <HelpCircle className="w-6 h-6 mb-2 text-gray-400" />
            <div className="text-xl font-bold text-white">
              {stats.undetected}
            </div>
            <div className="text-xs text-gray-400">Undetected</div>
          </div>

          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 mb-2 text-gray-400" />
            <div className="text-xl font-bold text-white">{stats.timeout}</div>
            <div className="text-xs text-gray-400">Timeout</div>
          </div>
        </div>
      </div>

      {/* Existing tab navigation remains the same */}
      <div className="border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-6 py-3 font-medium text-sm relative transition-all',
              {
                'text-blue-400': activeTab === 'overview',
                'text-gray-400 hover:text-gray-300': activeTab !== 'overview',
              }
            )}
          >
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('scanner-details')}
            className={cn(
              'px-6 py-3 font-medium text-sm relative transition-all',
              {
                'text-blue-400': activeTab === 'scanner-details',
                'text-gray-400 hover:text-gray-300':
                  activeTab !== 'scanner-details',
              }
            )}
          >
            Scanner Details
            {activeTab === 'scanner-details' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={cn(
              'px-6 py-3 font-medium text-sm relative transition-all',
              {
                'text-blue-400': activeTab === 'recommendations',
                'text-gray-400 hover:text-gray-300':
                  activeTab !== 'recommendations',
              }
            )}
          >
            Recommendations
            {activeTab === 'recommendations' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-[#191C27] rounded-lg p-5">
              <div className="flex items-center mb-4">
                <FileText className="mr-2 h-5 w-5 text-gray-400" />
                <h3 className="text-md font-semibold text-white">
                  Scan Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Item Type</span>
                  <span className="text-white">Url</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Level</span>
                  <span className="text-teal-500">Safe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Item Name</span>
                  <span className="text-white">{domainData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Detection Engine</span>
                  <span className="text-white">VirusTotal (Multi-Engine)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Scan Time</span>
                  <span className="text-white">
                    {formatDate(attributes.last_analysis_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white">completed</span>
                </div>
              </div>
            </div>

            <div className="bg-[#191C27] rounded-lg p-5">
              <div className="flex items-center mb-4">
                <Shield className="mr-2 h-5 w-5 text-gray-400" />
                <h3 className="text-md font-semibold text-white">
                  Detection Summary
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Harmless</span>
                    <span className="text-sm text-gray-300">
                      {stats.harmless} / {totalVendors}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{
                        width: `${(stats.harmless / totalVendors) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Suspicious</span>
                    <span className="text-sm text-gray-300">
                      {stats.suspicious} / {totalVendors}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${(stats.suspicious / totalVendors) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Malicious</span>
                    <span className="text-sm text-gray-300">
                      {stats.malicious} / {totalVendors}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(stats.malicious / totalVendors) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Undetected</span>
                    <span className="text-sm text-gray-300">
                      {stats.undetected} / {totalVendors}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full"
                      style={{
                        width: `${(stats.undetected / totalVendors) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#191C27] rounded-lg p-5">
              <div className="flex items-center mb-4">
                <Shield className="mr-2 h-5 w-5 text-gray-400" />
                <h3 className="text-md font-semibold text-white">
                  Detection Insight
                </h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                This url was analyzed by {totalVendors} security engines and
                found to be safe.
                {stats.harmless} engines specifically confirmed it as harmless,
                while
                {stats.undetected} were unable to make a determination.
              </p>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-500 mb-1">// Scanned URL</div>
                <div className="font-mono text-sm text-gray-300">
                  https://{domainData.id}/
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scanner-details' && (
          <div className="bg-[#191C27] rounded-lg p-5">
            <h3 className="text-md font-semibold mb-4 text-white">
              Scanner Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#12141D] p-3 rounded-md">
                  <div className="text-gray-400 text-sm">Item Type</div>
                  <div className="font-medium">{attributes.type}</div>
                </div>
                <div className="bg-[#12141D] p-3 rounded-md">
                  <div className="text-gray-400 text-sm">Risk Level</div>
                  <div className="font-medium text-teal-500">Safe</div>
                </div>
                <div className="bg-[#12141D] p-3 rounded-md">
                  <div className="text-gray-400 text-sm">Item Name</div>
                  <div className="font-medium">{domainData.id}</div>
                </div>
                <div className="bg-[#12141D] p-3 rounded-md">
                  <div className="text-gray-400 text-sm">Detection Engine</div>
                  <div className="font-medium">VirusTotal (Multi-Engine)</div>
                </div>
                <div className="bg-[#12141D] p-3 rounded-md">
                  <div className="text-gray-400 text-sm">Scan Time</div>
                  <div className="font-medium">
                    {formatDate(attributes.last_analysis_date)}
                  </div>
                </div>
                <div className="bg-[#12141D] p-3 rounded-md">
                  <div className="text-gray-400 text-sm">Status</div>
                  <div className="font-medium">completed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updated Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {(result === 'suspicious' || result === 'malicious') && (
              <div
                className={`rounded-lg p-5 ${
                  result === 'suspicious'
                    ? 'bg-yellow-500/10 border border-yellow-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <div className="flex items-start">
                  {result === 'suspicious' ? (
                    <AlertTriangle
                      size={18}
                      className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="text-red-500 mt-0.5 mr-2 flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {result === 'suspicious' ? 'Caution Advised' : 'Warning'}
                    </h3>
                    <p className="text-sm">{getRemediationAdvice()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#191C27] rounded-lg p-5">
              <h3 className="text-md font-semibold mb-4 text-white">
                Safety Recommendations
              </h3>

              <ul className="space-y-3 text-gray-300 text-sm">
                {result === 'clean' && (
                  <>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Continue to exercise standard online safety practices
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Verify the domain name before entering any sensitive
                        information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                      <span>Keep your security software up to date</span>
                    </li>
                  </>
                )}

                {result === 'suspicious' && (
                  <>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Do not enter any sensitive information on this url
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Consider using an alternative, verified source
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Run additional security scans or use different security
                        tools
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Report the suspicious url to your security team
                      </span>
                    </li>
                  </>
                )}

                {result === 'malicious' && (
                  <>
                    <li className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                      <span>Immediately avoid accessing this url</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Do not enter any personal or sensitive information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Clear browser cache and run a full system scan
                      </span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Report this malicious url to your security team or
                        hosting provider
                      </span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                      <span>
                        Consider changing passwords for critical accounts
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Existing New Scan button remains the same */}
      <div className="p-4 flex justify-center">
        <button
          onClick={onNewScan}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Scan
        </button>
      </div>
    </div>
  );
};

export default DomainAndIPScanResult;
