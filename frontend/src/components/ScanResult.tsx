import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Shield,
  InfoIcon,
  FileText,
  AlertCircle,
  ExternalLink,
  PieChart,
  Clock,
  Server,
} from 'lucide-react';
import { slideUpFade } from '@/lib/animations';
import React, { useState } from 'react';
import DomainAndIPScanResult from './DomainAndIPScanResult';
import GitScanResult from './GitScanResult';
import WebsiteScanResult from './WebsiteScanResult';

interface ScanResultProps {
  scanData: any; // The VirusTotal data
  scanType: 'file' | 'url' | 'domain' | 'ip' | 'code' | 'phishing';
  itemName: string;
  onNewScan: () => void;
}

export const ScanResult = ({
  scanData,
  scanType,
  itemName,
  onNewScan,
}: ScanResultProps) => {
  if (scanType === 'domain' || scanType === 'ip')
    return <DomainAndIPScanResult data={scanData} onNewScan={onNewScan} />;
  if (scanType == 'code') return <GitScanResult scanData={scanData} />;
  console.log('scanData: ', scanData);

  if (scanType === 'phishing')
    return <WebsiteScanResult websiteScanData={scanData} />;
  const [activeTab, setActiveTab] = useState('overview');

  // Process the VirusTotal data
  const processVirusTotalData = () => {
    if (!scanData || !scanData.data || !scanData.data.attributes) {
      return {
        result: 'unknown',
        stats: {
          malicious: 0,
          suspicious: 0,
          harmless: 0,
          undetected: 0,
          timeout: 0,
          total: 0,
        },
        scanners: [],
      };
    }

    const stats = scanData.data.attributes.stats;
    const totalScanners =
      stats.malicious +
      stats.suspicious +
      stats.harmless +
      stats.undetected +
      stats.timeout;

    // Determine overall result
    let result = 'clean';
    if (stats.malicious > 0) {
      result = 'malicious';
    } else if (stats.suspicious > 0) {
      result = 'suspicious';
    }

    // Format scanner results
    const scanners = Object.entries(scanData.data.attributes.results).map(
      ([name, data]: [string, any]) => ({
        name,
        category: data.category,
        result: data.result,
        method: data.method,
      })
    );

    return {
      result,
      stats: {
        ...stats,
        total: totalScanners,
      },
      scanners,
    };
  };

  const vtData = processVirusTotalData();

  // Get UI elements based on result
  const getResultUI = () => {
    switch (vtData.result) {
      case 'clean':
        return {
          title: 'No Threats Detected',
          description: `This ${scanType} appears to be safe. ${vtData.stats.harmless} security vendors confirmed it's harmless.`,
          icon: <CheckCircle size={28} />,
          color: 'text-spark-green',
          bgColor: 'bg-spark-green/10',
          borderColor: 'border-spark-green/20',
        };
      case 'suspicious':
        return {
          title: 'Potentially Suspicious',
          description: `This ${scanType} was flagged as suspicious by ${vtData.stats.suspicious} security vendors.`,
          icon: <AlertTriangle size={28} />,
          color: 'text-spark-yellow',
          bgColor: 'bg-spark-yellow/10',
          borderColor: 'border-spark-yellow/20',
        };
      case 'malicious':
        return {
          title: 'Threat Detected',
          icon: <XCircle size={28} />,
          description: `This ${scanType} was identified as malicious by ${vtData.stats.malicious} security vendors.`,
          color: 'text-spark-red',
          bgColor: 'bg-spark-red/10',
          borderColor: 'border-spark-red/20',
        };
      default:
        return {
          title: 'Scan Completed',
          description: `Scan results for this ${scanType} are available.`,
          icon: <InfoIcon size={28} />,
          color: 'text-spark-blue',
          bgColor: 'bg-spark-blue/10',
          borderColor: 'border-spark-blue/20',
        };
    }
  };

  const resultUI = getResultUI();

  // Convert timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Get remediation advice based on result and scan type
  const getRemediationAdvice = () => {
    if (vtData.result === 'clean') {
      return 'No action needed. This item is safe to use.';
    } else if (vtData.result === 'suspicious') {
      switch (scanType) {
        case 'file':
          return 'Exercise caution with this file. Consider scanning with another tool or avoid opening if uncertain.';
        case 'url':
      }
    } else {
      switch (scanType) {
        case 'file':
          return 'Delete this file immediately. It contains malicious code that can harm your system.';
        case 'url':
      }
    }
  };

  // Filter scanners based on their category
  const getFilteredScanners = (category) => {
    return vtData.scanners.filter((scanner) => scanner.category === category);
  };

  // Get color based on scanner result
  const getScannerColor = (category) => {
    switch (category) {
      case 'harmless':
        return 'text-spark-green';
      case 'suspicious':
        return 'text-spark-yellow';
      case 'malicious':
        return 'text-spark-red';
      default:
        return 'text-spark-gray-300';
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <motion.div
        variants={slideUpFade}
        initial="hidden"
        animate="visible"
        className="glass-card p-6 rounded-xl mb-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            className={`w-20 h-20 rounded-full ${resultUI.bgColor} ${resultUI.color} flex items-center justify-center mb-4 border ${resultUI.borderColor}`}
          >
            {resultUI.icon}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">{resultUI.title}</h2>
          <p className="text-spark-gray-300 max-w-md">{resultUI.description}</p>

          {/* Stats summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 w-full max-w-2xl">
            <div className="glass-panel rounded-lg p-3 flex flex-col items-center">
              <div className="text-spark-green mb-1">
                <CheckCircle size={16} />
              </div>
              <div className="text-xl font-bold">{vtData.stats.harmless}</div>
              <div className="text-xs text-spark-gray-300">Harmless</div>
            </div>
            <div className="glass-panel rounded-lg p-3 flex flex-col items-center">
              <div className="text-spark-yellow mb-1">
                <AlertTriangle size={16} />
              </div>
              <div className="text-xl font-bold">{vtData.stats.suspicious}</div>
              <div className="text-xs text-spark-gray-300">Suspicious</div>
            </div>
            <div className="glass-panel rounded-lg p-3 flex flex-col items-center">
              <div className="text-spark-red mb-1">
                <XCircle size={16} />
              </div>
              <div className="text-xl font-bold">{vtData.stats.malicious}</div>
              <div className="text-xs text-spark-gray-300">Malicious</div>
            </div>
            <div className="glass-panel rounded-lg p-3 flex flex-col items-center">
              <div className="text-spark-gray-300 mb-1">
                <InfoIcon size={16} />
              </div>
              <div className="text-xl font-bold">{vtData.stats.undetected}</div>
              <div className="text-xs text-spark-gray-300">Undetected</div>
            </div>
            <div className="glass-panel rounded-lg p-3 flex flex-col items-center">
              <div className="text-spark-gray-300 mb-1">
                <Clock size={16} />
              </div>
              <div className="text-xl font-bold">{vtData.stats.timeout}</div>
              <div className="text-xs text-spark-gray-300">Timeout</div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex mb-4 border-b border-spark-dark-500">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-spark-blue border-b-2 border-spark-blue'
                : 'text-spark-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'details'
                ? 'text-spark-blue border-b-2 border-spark-blue'
                : 'text-spark-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Scanner Details
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'recommendations'
                ? 'text-spark-blue border-b-2 border-spark-blue'
                : 'text-spark-gray-300'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="glass-panel rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <FileText size={18} className="text-spark-gray-300 mr-2" />
                <h3 className="text-lg font-medium">Scan Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between py-2 border-b border-spark-dark-500">
                    <span className="text-spark-gray-300">Item Type</span>
                    <span className="font-medium">
                      {scanType.charAt(0).toUpperCase() + scanType.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-spark-dark-500">
                    <span className="text-spark-gray-300">Item Name</span>
                    <span
                      className="font-medium font-mono truncate max-w-[200px]"
                      title={itemName}
                    >
                      {itemName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-spark-dark-500">
                    <span className="text-spark-gray-300">Scan Time</span>
                    <span className="font-medium">
                      {formatDate(scanData?.data?.attributes?.date)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between py-2 border-b border-spark-dark-500">
                    <span className="text-spark-gray-300">Risk Level</span>
                    <span
                      className={
                        vtData.result === 'clean'
                          ? 'text-spark-green font-medium'
                          : vtData.result === 'suspicious'
                          ? 'text-spark-yellow font-medium'
                          : 'text-spark-red font-medium'
                      }
                    >
                      {vtData.result === 'clean'
                        ? 'Safe'
                        : vtData.result === 'suspicious'
                        ? 'Medium'
                        : 'High'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-spark-dark-500">
                    <span className="text-spark-gray-300">
                      Detection Engine
                    </span>
                    <span className="font-medium">
                      VirusTotal (Multi-Engine)
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-spark-dark-500">
                    <span className="text-spark-gray-300">Status</span>
                    <span className="font-medium">
                      {scanData?.data?.attributes?.status || 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <PieChart size={18} className="text-spark-gray-300 mr-2" />
                <h3 className="text-lg font-medium">Detection Summary</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-spark-dark-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-spark-gray-300">Harmless</span>
                    <span className="text-spark-green font-medium">
                      {vtData.stats.harmless} / {vtData.stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-spark-dark-500 rounded-full h-2">
                    <div
                      className="bg-spark-green h-2 rounded-full"
                      style={{
                        width: `${
                          (vtData.stats.harmless / vtData.stats.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="bg-spark-dark-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-spark-gray-300">Suspicious</span>
                    <span className="text-spark-yellow font-medium">
                      {vtData.stats.suspicious} / {vtData.stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-spark-dark-500 rounded-full h-2">
                    <div
                      className="bg-spark-yellow h-2 rounded-full"
                      style={{
                        width: `${
                          (vtData.stats.suspicious / vtData.stats.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="bg-spark-dark-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-spark-gray-300">Malicious</span>
                    <span className="text-spark-red font-medium">
                      {vtData.stats.malicious} / {vtData.stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-spark-dark-500 rounded-full h-2">
                    <div
                      className="bg-spark-red h-2 rounded-full"
                      style={{
                        width: `${
                          (vtData.stats.malicious / vtData.stats.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="bg-spark-dark-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-spark-gray-300">Undetected</span>
                    <span className="text-spark-gray-300 font-medium">
                      {vtData.stats.undetected} / {vtData.stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-spark-dark-500 rounded-full h-2">
                    <div
                      className="bg-spark-gray-400 h-2 rounded-full"
                      style={{
                        width: `${
                          (vtData.stats.undetected / vtData.stats.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {(vtData.result === 'suspicious' ||
              vtData.result === 'malicious') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-lg p-4 mb-6 ${
                  vtData.result === 'suspicious'
                    ? 'bg-spark-yellow/10 border border-spark-yellow/20'
                    : 'bg-spark-red/10 border border-spark-red/20'
                }`}
              >
                <div className="flex items-start">
                  {vtData.result === 'suspicious' ? (
                    <AlertTriangle
                      size={18}
                      className="text-spark-yellow mt-0.5 mr-2 flex-shrink-0"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="text-spark-red mt-0.5 mr-2 flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {vtData.result === 'suspicious'
                        ? 'Recommendation'
                        : 'Warning'}
                    </h3>
                    <p className="text-sm">{getRemediationAdvice()}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="glass-panel rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <InfoIcon size={18} className="text-spark-gray-300 mr-2" />
                <h3 className="text-lg font-medium">Detection Insight</h3>
              </div>
              <p className="text-sm text-spark-gray-300 mb-4">
                {vtData.result === 'clean'
                  ? `This ${scanType} was analyzed by ${vtData.stats.total} security engines and found to be safe. ${vtData.stats.harmless} engines specifically confirmed it as harmless, while ${vtData.stats.undetected} were unable to make a determination.`
                  : vtData.result === 'suspicious'
                  ? `This ${scanType} was flagged as suspicious by ${vtData.stats.suspicious} out of ${vtData.stats.total} security engines. While not definitively malicious, these detections suggest potentially unsafe content.`
                  : `This ${scanType} was identified as malicious by ${vtData.stats.malicious} out of ${vtData.stats.total} security engines. This indicates a high likelihood of security risk.`}
              </p>
              {scanData?.meta?.url_info?.url && (
                <div className="bg-spark-dark-700/80 rounded-lg p-3 text-xs font-mono">
                  <div className="text-spark-gray-200 mb-1">// Scanned URL</div>
                  <div className="text-spark-gray-300 break-all">
                    {scanData.meta.url_info.url}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Scanner Details Tab */}
        {activeTab === 'details' && (
          <div className="glass-panel rounded-lg p-4 mb-6">
            <div className="flex items-center mb-4">
              <Shield size={18} className="text-spark-gray-300 mr-2" />
              <h3 className="text-lg font-medium">Scanner Results</h3>
              <span className="ml-2 text-xs text-spark-gray-300 bg-spark-dark-700 px-2 py-0.5 rounded-full">
                {vtData.scanners.length} Scanners
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
              <button
                className="px-3 py-1 text-xs font-medium bg-spark-dark-700 hover:bg-spark-dark-600 rounded-full whitespace-nowrap"
                onClick={() => setActiveTab('details')}
              >
                All ({vtData.scanners.length})
              </button>
              <button
                className="px-3 py-1 text-xs font-medium bg-spark-green/20 hover:bg-spark-green/30 text-spark-green rounded-full whitespace-nowrap"
                onClick={() => setActiveTab('harmless')}
              >
                Harmless ({getFilteredScanners('harmless').length})
              </button>
              <button
                className="px-3 py-1 text-xs font-medium bg-spark-yellow/20 hover:bg-spark-yellow/30 text-spark-yellow rounded-full whitespace-nowrap"
                onClick={() => setActiveTab('suspicious')}
              >
                Suspicious ({getFilteredScanners('suspicious').length})
              </button>
              <button
                className="px-3 py-1 text-xs font-medium bg-spark-red/20 hover:bg-spark-red/30 text-spark-red rounded-full whitespace-nowrap"
                onClick={() => setActiveTab('malicious')}
              >
                Malicious ({getFilteredScanners('malicious').length})
              </button>
              <button
                className="px-3 py-1 text-xs font-medium bg-spark-dark-700 hover:bg-spark-dark-600 rounded-full whitespace-nowrap"
                onClick={() => setActiveTab('undetected')}
              >
                Undetected ({getFilteredScanners('undetected').length})
              </button>
            </div>

            {/* Scanner Results Table */}
            <div className="overflow-auto max-h-96 scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="text-xs text-spark-gray-300 uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Scanner</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Result</th>
                    <th className="px-4 py-2 text-left">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-spark-dark-600">
                  {vtData.scanners.slice(0, 50).map((scanner, index) => (
                    <tr key={index} className="hover:bg-spark-dark-700/50">
                      <td className="px-4 py-2 font-medium">{scanner.name}</td>
                      <td
                        className={`px-4 py-2 ${getScannerColor(
                          scanner.category
                        )}`}
                      >
                        {scanner.category.charAt(0).toUpperCase() +
                          scanner.category.slice(1)}
                      </td>
                      <td className="px-4 py-2">{scanner.result}</td>
                      <td className="px-4 py-2 text-spark-gray-300">
                        {scanner.method}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vtData.scanners.length > 50 && (
                <div className="text-center text-spark-gray-300 text-xs mt-2">
                  Showing 50 of {vtData.scanners.length} scanners
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="glass-panel rounded-lg p-4 mb-6">
            <div className="flex items-center mb-4">
              <InfoIcon size={18} className="text-spark-gray-300 mr-2" />
              <h3 className="text-lg font-medium">Recommendations</h3>
            </div>

            <div
              className={`p-4 rounded-lg mb-4 ${
                vtData.result === 'clean'
                  ? 'bg-spark-green/10 border border-spark-green/20'
                  : vtData.result === 'suspicious'
                  ? 'bg-spark-yellow/10 border border-spark-yellow/20'
                  : 'bg-spark-red/10 border border-spark-red/20'
              }`}
            >
              <h4 className="text-md font-medium mb-2">Security Assessment</h4>
              <p className="text-sm mb-4">
                {vtData.result === 'clean'
                  ? `This ${scanType} was analyzed by multiple security engines and found to be safe. No immediate action is required.`
                  : vtData.result === 'suspicious'
                  ? `This ${scanType} has been flagged as potentially suspicious. While not definitively harmful, it's recommended to exercise caution.`
                  : `This ${scanType} has been identified as malicious by multiple security engines. It's strongly recommended to avoid any interaction with it.`}
              </p>

              <h4 className="text-md font-medium mb-2">Recommended Actions</h4>
              <ul className="text-sm space-y-2 list-disc pl-5">
                {vtData.result === 'clean' && (
                  <>
                    <li>No security action is required at this time.</li>
                    <li>
                      As with any online content, maintain general security
                      awareness.
                    </li>
                    <li>Ensure your security software remains up to date.</li>
                  </>
                )}

                {vtData.result === 'suspicious' && (
                  <>
                    <li>
                      Proceed with caution when interacting with this {scanType}
                      .
                    </li>
                    <li>
                      Consider scanning with additional security tools before
                      proceeding.
                    </li>
                    <li>
                      If you're unsure, it's best to avoid interaction
                      altogether.
                    </li>
                    <li>Report any unusual behavior to your security team.</li>
                  </>
                )}

                {vtData.result === 'malicious' && (
                  <>
                    <li>Avoid any interaction with this {scanType}.</li>
                    <li>
                      If this is a file that was downloaded, delete it
                      immediately.
                    </li>
                    <li>
                      If this is a website, do not visit it or enter any
                      information.
                    </li>
                    <li>
                      If you've already interacted with it, run a full system
                      scan using your security software.
                    </li>
                    <li>
                      Consider changing passwords if you've entered sensitive
                      information.
                    </li>
                    <li>
                      Report this threat to your organization's security team.
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="p-4 bg-spark-dark-700/50 rounded-lg">
              <h4 className="text-md font-medium mb-2">
                Additional Security Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <a
                  href="#"
                  className="flex items-center p-3 bg-spark-dark-600/50 rounded-lg hover:bg-spark-dark-600"
                >
                  <Shield className="text-spark-blue mr-2" size={16} />
                  <span>Security Best Practices Guide</span>
                  <ExternalLink size={12} className="ml-auto" />
                </a>
                <a
                  href="#"
                  className="flex items-center p-3 bg-spark-dark-600/50 rounded-lg hover:bg-spark-dark-600"
                >
                  <Server className="text-spark-blue mr-2" size={16} />
                  <span>Threat Intelligence Database</span>
                  <ExternalLink size={12} className="ml-auto" />
                </a>
                <a
                  href="#"
                  className="flex items-center p-3 bg-spark-dark-600/50 rounded-lg hover:bg-spark-dark-600"
                >
                  <AlertCircle className="text-spark-blue mr-2" size={16} />
                  <span>Report False Positive</span>
                  <ExternalLink size={12} className="ml-auto" />
                </a>
                <a
                  href="#"
                  className="flex items-center p-3 bg-spark-dark-600/50 rounded-lg hover:bg-spark-dark-600"
                >
                  <InfoIcon className="text-spark-blue mr-2" size={16} />
                  <span>Learn About This Threat Type</span>
                  <ExternalLink size={12} className="ml-auto" />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={onNewScan}
            className="flex items-center gap-2 px-6 py-3 bg-spark-blue/10 hover:bg-spark-blue/20 text-spark-blue rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            New Scan
          </button>
        </div>
      </motion.div>
    </div>
  );
};
