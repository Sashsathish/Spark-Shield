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

const GitScanResult = ({ scanData }: { scanData: any }) => {
  // Actual data from the backend
  //   const scanData = {
  //     trust: 'Trusted Owner: Ranjithdurai451',
  //     results: [
  //       {
  //         file: 'repos/94a71eed-79e4-451c-bb88-c30f427b304b/backend/server.js',
  //         status: '✅ Safe',
  //       },
  //       {
  //         file: 'repos/94a71eed-79e4-451c-bb88-c30f427b304b/frontend/postcss.config.js',
  //         status: '✅ Safe',
  //       },
  //       {
  //         file: 'repos/94a71eed-79e4-451c-bb88-c30f427b304b/frontend/tailwind.config.js',
  //         status: '✅ Safe',
  //       },
  //     ],
  //   };

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div className="text-center space-y-3">
        <div className="p-4 rounded-full bg-teal-500 w-16 h-16 flex items-center justify-center mx-auto">
          <CheckCircle size={28} className="text-[#0d0f17]" />
        </div>
        <h1 className="text-2xl font-bold text-white">No Threats Detected</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          This repository appears to be safe. All files have been scanned and
          verified.
        </p>
        <p className="text-teal-500 font-medium">{scanData.trust}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatusCard type="harmless" count={safeCount} delay={100} />
        <StatusCard type="suspicious" count={suspiciousCount} delay={200} />
        <StatusCard type="malicious" count={maliciousCount} delay={300} />
      </div>

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

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800">
              <FileCode size={18} className="text-gray-400" />
              <h3 className="font-medium text-white">Scan Details</h3>
            </div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 flex items-center gap-2">
                      <GitBranch size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">Owner</span>
                    </td>
                    <td className="py-3 text-right flex items-center justify-end gap-2">
                      <span className="text-sm text-white">
                        {scanData.trust.replace('Trusted Owner: ', '')}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-500">
                          Trusted
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 flex items-center gap-2">
                      <FileCode size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Files Scanned
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm text-white">{totalFiles}</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">Scan Time</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm text-white">
                        {new Date().toLocaleString()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 flex items-center gap-2">
                      <Info size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">Status</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm text-white">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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

          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800">
              <Info size={18} className="text-gray-400" />
              <h3 className="font-medium text-white">Analysis Insight</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-400 text-sm leading-relaxed">
                This repository was analyzed and found to be safe. {safeCount}{' '}
                files were confirmed as harmless, with no suspicious or
                malicious code detected.
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

        <TabsContent value="recommendations" className="mt-6">
          <div className="glass-card p-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              The repository has been found to be safe. Here are some general
              security recommendations:
            </p>
            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-teal-500/10 text-teal-500 mt-0.5">
                  <Shield size={14} />
                </div>
                <span>
                  Regularly update dependencies to patch security
                  vulnerabilities.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-teal-500/10 text-teal-500 mt-0.5">
                  <Shield size={14} />
                </div>
                <span>
                  Implement security scanning as part of your CI/CD pipeline.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-teal-500/10 text-teal-500 mt-0.5">
                  <Shield size={14} />
                </div>
                <span>Enable branch protection rules for your repository.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GitScanResult;
