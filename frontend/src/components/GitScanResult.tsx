import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  GitBranch,
  Clock,
  FileCode,
  AlertCircle,
  CheckCircle,
  Info,
  Globe,
  XCircle,
  InfoIcon,
  AlertTriangle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusCard } from './ui/StatusCard';
import { motion } from 'framer-motion';

const GitScanResult = ({ scanData }: { scanData: any }) => {
  // Calculate counts based on statuses
  const safeCount = scanData.results.filter(
    (item) => item.status === '✅ Safe'
  ).length;
  const suspiciousCount = scanData.results.filter((item) =>
    item.status.includes('⚠️')
  ).length;
  const maliciousCount = scanData.results.filter((item) =>
    item.status.includes('❌')
  ).length;
  const totalFiles = scanData.results.length;

  // Determine overall status message dynamically
  const hasMalicious = maliciousCount > 0;
  const hasSuspicious = suspiciousCount > 0;
  const hasOnlySafe = safeCount === totalFiles;

  const getStatusMessage = () => {
    if (hasMalicious) {
      return {
        title: 'Threats Detected',
        subtitle: 'This repository contains malicious files.',
        icon: <XCircle size={28} />,
        color: 'text-spark-red',
        bgColor: 'bg-spark-red/10',
        borderColor: 'border-spark-red/20',
      };
    } else if (hasSuspicious) {
      return {
        title: 'Suspicious Files Found',
        subtitle: 'Some files in this repository require further inspection.',
        icon: <AlertTriangle size={28} />,
        color: 'text-spark-yellow',
        bgColor: 'bg-spark-yellow/10',
        borderColor: 'border-spark-yellow/20',
      };
    } else if (hasOnlySafe) {
      return {
        title: 'No Threats Detected',
        subtitle: 'This repository appears to be safe.',
        icon: <CheckCircle size={28} />,
        color: 'text-spark-green',
        bgColor: 'bg-spark-green/10',
        borderColor: 'border-spark-green/20',
      };
    }
    return {
      title: 'Scan Completed',
      subtitle: 'The repository was scanned successfully.',
      icon: <InfoIcon size={28} />,
      color: 'text-spark-blue',
      bgColor: 'bg-spark-blue/10',
      borderColor: 'border-spark-blue/20',
    };
  };

  const statusMessage = getStatusMessage();

  const scanDetails = [
    {
      label: 'Owner',
      value: scanData.trust.replace('Trusted Owner: ', ''),
      icon: <GitBranch size={18} />,
    },
    { label: 'Trust Level', value: 'Trusted', icon: <Shield size={18} /> },
    {
      label: 'Files Scanned',
      value: `${totalFiles}`,
      icon: <FileCode size={18} />,
    },
    {
      label: 'Scan Time',
      value: new Date().toLocaleString(),
      icon: <Clock size={18} />,
    },
  ];

  // Dynamic Recommendations based on scan results
  const getDynamicRecommendations = () => {
    const recommendations = [];

    if (maliciousCount > 0) {
      recommendations.push(
        <li key="malicious-1" className="flex items-start gap-2">
          <div className="p-1 rounded-full bg-red-500/10 text-red-500 mt-0.5">
            <AlertCircle size={14} />
          </div>
          <span>
            Immediately quarantine and investigate the{' '}
            <strong>{maliciousCount}</strong> malicious file(s) detected.
          </span>
        </li>,
        <li key="malicious-2" className="flex items-start gap-2">
          <div className="p-1 rounded-full bg-red-500/10 text-red-500 mt-0.5">
            <AlertCircle size={14} />
          </div>
          <span>
            Review recent commits and contributors for potential compromises.
          </span>
        </li>
      );
    }

    if (suspiciousCount > 0) {
      recommendations.push(
        <li key="suspicious-1" className="flex items-start gap-2">
          <div className="p-1 rounded-full bg-yellow-500/10 text-yellow-500 mt-0.5">
            <AlertCircle size={14} />
          </div>
          <span>
            Investigate the <strong>{suspiciousCount}</strong> suspicious
            file(s) for potential vulnerabilities.
          </span>
        </li>,
        <li key="suspicious-2" className="flex items-start gap-2">
          <div className="p-1 rounded-full bg-yellow-500/10 text-yellow-500 mt-0.5">
            <AlertCircle size={14} />
          </div>
          <span>
            Use static analysis tools to verify the integrity of flagged files.
          </span>
        </li>
      );
    }

    if (safeCount > 0) {
      recommendations.push(
        <li key="safe-1" className="flex items-start gap-2">
          <div className="p-1 rounded-full bg-teal-500/10 text-teal-500 mt-0.5">
            <Shield size={14} />
          </div>
          <span>
            Maintain regular updates to dependencies to prevent future issues.
          </span>
        </li>,
        <li key="safe-2" className="flex items-start gap-2">
          <div className="p-1 rounded-full bg-teal-500/10 text-teal-500 mt-0.5">
            <Shield size={14} />
          </div>
          <span>
            Continue integrating security scanning into your CI/CD pipeline.
          </span>
        </li>
      );
    }

    return recommendations;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Dynamic Status Header */}
      <div className="text-center space-y-3">
        {/* <div
          className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto ${
            statusMessage.color === 'text-red-500'
              ? 'bg-red-500'
              : statusMessage.color === 'text-yellow-500'
              ? 'bg-yellow-500'
              : 'bg-teal-500'
          }`}
        >
          {statusMessage.icon}
        </div>
        <h1 className="text-2xl font-bold text-white">{statusMessage.title}</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          {statusMessage.subtitle}
        </p> */}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 200,
            damping: 10,
          }}
          className={`w-20 h-20 rounded-full ${statusMessage.bgColor} ${statusMessage.color} flex items-center justify-center mx-auto border ${statusMessage.borderColor}`}
        >
          {statusMessage.icon}
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{statusMessage.title}</h2>
        <p className="text-spark-gray-300 max-w-md mx-auto">
          {statusMessage.subtitle}
        </p>
        <p className="text-teal-500 font-medium">{scanData.trust}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatusCard type="harmless" count={safeCount} delay={100} />
        <StatusCard type="suspicious" count={suspiciousCount} delay={200} />
        <StatusCard type="malicious" count={maliciousCount} delay={300} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full flex space-x-4 justify-start border-b border-gray-800 rounded-none bg-transparent p-0 mb-6">
          <TabsTrigger value="overview" className="tab-button">
            Overview
          </TabsTrigger>
          <TabsTrigger value="file-results" className="tab-button">
            File Results
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="tab-button">
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800">
              <FileCode size={18} className="text-gray-400" />
              <h3 className="font-medium text-white">Scan Details</h3>
            </div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {scanDetails.map((detail, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3 flex items-center gap-2">
                        {detail.icon}
                        <span className="text-sm text-gray-400">
                          {detail.label}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm text-white">
                          {detail.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detection Summary */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800">
              <Shield size={18} className="text-gray-400" />
              <h3 className="font-medium text-white">Detection Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-teal-500">Safe</span>
                  <span className="text-teal-500">
                    {safeCount} / {totalFiles}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${(safeCount / totalFiles) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-500">Suspicious</span>
                  <span className="text-yellow-500">
                    {suspiciousCount} / {totalFiles}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${(suspiciousCount / totalFiles) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-500">Malicious</span>
                  <span className="text-red-500">
                    {maliciousCount} / {totalFiles}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(maliciousCount / totalFiles) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Insight */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800">
              <Info size={18} className="text-gray-400" />
              <h3 className="font-medium text-white">Analysis Insight</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-400 text-sm leading-relaxed">
                {statusMessage.subtitle}{' '}
                {safeCount > 0 &&
                  `${safeCount} files were confirmed as harmless.`}
                {suspiciousCount > 0 &&
                  `${suspiciousCount} files were flagged as suspicious.`}
                {maliciousCount > 0 &&
                  `${maliciousCount} files were detected as malicious.`}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <code>//</code> Repository by{' '}
                  {scanData.trust.replace('Trusted Owner: ', '')}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* File Results Tab */}
        <TabsContent value="file-results" className="mt-6">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
              <FileCode size={18} className="text-gray-400" />
              <h3 className="font-medium text-white">File Scan Results</h3>
            </div>
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-white">File Path</TableHead>
                    <TableHead className="text-white text-right w-28">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanData.results.map((file, index) => (
                    <TableRow key={index} className="border-gray-800">
                      <TableCell className="text-gray-400 font-mono text-sm break-all">
                        {file.file.split('/').pop()}
                        <span className="block text-xs text-gray-600 mt-1">
                          {file.file.substring(0, file.file.lastIndexOf('/'))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {file.status === '✅ Safe' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="px-2 py-1 rounded text-xs bg-teal-500/10 text-teal-500 flex items-center gap-1">
                              <CheckCircle size={12} />
                              Safe
                            </span>
                          </div>
                        ) : file.status.includes('⚠️') ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              Suspicious
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              Malicious
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6">
          <div className="glass-card p-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              Based on the scan results, here are some tailored recommendations:
            </p>
            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
              {getDynamicRecommendations()}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GitScanResult;
