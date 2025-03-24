import { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  Shield,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface DomainAndIPScanResultProps {
  data: any;
  onNewScan?: () => void;
}

const DomainAndIPScanResult = ({
  data,
  onNewScan,
}: DomainAndIPScanResultProps) => {
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
  const isSafe = stats.malicious === 0 && stats.suspicious === 0;

  return (
    <div className="bg-[#12141D] rounded-lg overflow-hidden max-w-3xl mx-auto text-gray-200 border border-gray-800">
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-teal-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-white">
          No Threats Detected
        </h1>
        <p className="text-gray-400 text-balance max-w-lg mx-auto">
          This url appears to be safe. {stats.harmless} security vendors
          confirmed it's harmless.
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
                  <div className="font-medium">Url</div>
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

        {activeTab === 'recommendations' && (
          <div className="bg-[#191C27] rounded-lg p-5">
            <h3 className="text-md font-semibold mb-4 text-white">
              Safety Recommendations
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              This domain appears to be safe based on our analysis. Here are
              some general safety tips:
            </p>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                <span>
                  Always verify the domain name before entering sensitive
                  information
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                <span>Use strong, unique passwords for different websites</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                <span>Keep your browser and operating system up to date</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-teal-500 mr-2 shrink-0 mt-0.5" />
                <span>
                  Consider using a password manager and two-factor
                  authentication
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

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
