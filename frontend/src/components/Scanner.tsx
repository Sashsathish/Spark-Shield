import { useState, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Upload, Github, Image } from 'lucide-react';
import { ScanResult } from './ScanResult';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  scanUrl,
  scanDomain,
  scanIp,
  scanRepo,
  scanFile,
  detectClone,
} from '@/lib/actions';

interface ScannerProps {
  title: string;
  description: string;
  icon: ReactNode;
  placeholder: string;
  scanType: 'file' | 'url' | 'domain' | 'ip' | 'code' | 'phishing';
}

export const Scanner = ({
  title,
  description,
  icon,
  placeholder,
  scanType,
}: ScannerProps) => {
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scanResult, setScanResult] = useState();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  // Add a state to store the actual file object
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset validation error when input changes
  useEffect(() => {
    setValidationError(null);
  }, [input]);

  const validateInput = (): boolean => {
    if (!input) {
      setValidationError('Please provide a valid input');
      return false;
    }

    switch (scanType) {
      case 'url':
        // URL validation with regex
        const urlPattern =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(input)) {
          setValidationError(
            'Please enter a valid URL (e.g., https://example.com)'
          );
          return false;
        }
        // Check if URL includes protocol
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
          setValidationError('URL must include http:// or https://');
          return false;
        }
        break;

      case 'domain':
        // Domain validation with regex
        const domainPattern = /^([\da-z][-\da-z]{0,62})\.([a-z.]{2,})$/i;
        if (!domainPattern.test(input)) {
          setValidationError(
            'Please enter a valid domain name (e.g., example.com)'
          );
          return false;
        }
        break;

      case 'ip':
        // IPv4 validation with regex
        const ipv4Pattern =
          /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        // IPv6 validation with regex (simplified)
        const ipv6Pattern =
          /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(([0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){5}(((:[0-9a-fA-F]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){4}(((:[0-9a-fA-F]{1,4}){1,3})|((:[0-9a-fA-F]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){3}(((:[0-9a-fA-F]{1,4}){1,4})|((:[0-9a-fA-F]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){2}(((:[0-9a-fA-F]{1,4}){1,5})|((:[0-9a-fA-F]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){1}(((:[0-9a-fA-F]{1,4}){1,6})|((:[0-9a-fA-F]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-fA-F]{1,4}){1,7})|((:[0-9a-fA-F]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))$/;

        if (!ipv4Pattern.test(input) && !ipv6Pattern.test(input)) {
          setValidationError('Please enter a valid IP address');
          return false;
        }
        break;

      case 'code':
        // GitHub repo validation
        const githubRepoPattern =
          /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
        if (!githubRepoPattern.test(input)) {
          setValidationError(
            'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)'
          );
          return false;
        }
        break;

      case 'file':
        // File validation
        if (!selectedFile) {
          setValidationError('Please select a file to scan');
          return false;
        }

        // Check file size (limit to 50MB)
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        if (fileSize && fileSize > MAX_FILE_SIZE) {
          setValidationError(`File size exceeds the maximum limit of 50MB`);
          return false;
        }
        break;

      case 'phishing':
        // Image file validation
        if (!selectedFile) {
          setValidationError('Please select a screenshot image to analyze');
          return false;
        }

        // Check if file is an image
        const validImageTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (fileType && !validImageTypes.includes(fileType)) {
          setValidationError(
            'Please select a valid image file (JPEG, PNG, GIF, WebP)'
          );
          return false;
        }

        // Check image file size (limit to 10MB)
        const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        if (fileSize && fileSize > MAX_IMAGE_SIZE) {
          setValidationError(`Image size exceeds the maximum limit of 10MB`);
          return false;
        }
        break;
    }

    return true;
  };

  const handleScan = async () => {
    if (!validateInput()) return;

    setIsScanning(true);

    try {
      let response;
      switch (scanType) {
        case 'url':
          response = await scanUrl(input);
          break;
        case 'domain':
          response = await scanDomain(input);
          break;
        case 'ip':
          response = await scanIp(input);
          break;
        case 'code':
          response = await scanRepo(input);
          break;
        case 'file':
          if (selectedFile) {
            response = await scanFile(selectedFile);
          } else {
            throw new Error('No file selected');
          }
          break;
        case 'phishing':
          if (selectedFile) {
            response = await detectClone(selectedFile);
          } else {
            throw new Error('No image selected');
          }
          break;
        default:
          throw new Error('Invalid scan type');
      }

      console.log('Scan Result:', response);
      setScanResult(response);
      setShowResults(true);
    } catch (error) {
      console.error('Error during scan:', error);
      // More specific error handling
      if (error instanceof Error) {
        setValidationError(
          `Scan error: ${error.message || 'Please try again.'}`
        );
      } else {
        setValidationError(
          'An error occurred during the scan. Please try again.'
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (
      (scanType === 'file' || scanType === 'phishing') &&
      e.dataTransfer.files.length > 0
    ) {
      const file = e.dataTransfer.files[0];
      setInput(file.name);
      setFileSize(file.size);
      setFileType(file.type);
      setSelectedFile(file); // Store the actual file object
      setValidationError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setInput(file.name);
      setFileSize(file.size);
      setFileType(file.type);
      setSelectedFile(file); // Store the actual file object
      setValidationError(null);
    }
  };

  const resetScan = () => {
    setInput('');
    setShowResults(false);
    setValidationError(null);
    setFileSize(null);
    setFileType(null);
    setSelectedFile(null); // Clear the file reference
  };

  const renderValidationError = () => {
    if (!validationError) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mt-2 text-sm text-red-500"
      >
        <AlertCircle size={14} className="mr-1" />
        {validationError}
      </motion.div>
    );
  };

  const renderInputSection = () => {
    if (scanType === 'phishing') {
      return (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-spark-blue bg-spark-blue/5'
              : validationError
              ? 'border-red-500'
              : 'border-spark-dark-500 hover:border-spark-blue/50'
          }`}
        >
          <Image className="w-12 h-12 mx-auto mb-4 text-spark-gray-300" />
          <h3 className="mb-2 text-lg font-medium">
            Upload a screenshot of the suspicious website
          </h3>
          <p className="mb-4 text-sm text-spark-gray-300">
            Our AI will analyze the screenshot for phishing indicators
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 transition-colors border rounded-lg cursor-pointer bg-spark-blue/10 hover:bg-spark-blue/20 text-spark-blue border-spark-blue/20"
          >
            Browse Screenshots
          </label>
          {input && (
            <div className="mt-4 text-sm text-spark-gray-200">
              Selected: <span className="font-medium">{input}</span>
              {fileSize && (
                <span className="ml-2 text-spark-gray-400">
                  ({(fileSize / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>
          )}
          {renderValidationError()}

          {/* Add scan button directly in the phishing section */}
          {input && (
            <div className="mt-6">
              <button
                onClick={handleScan}
                disabled={isScanning || !!validationError}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto ${
                  isScanning || validationError
                    ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                    : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    Analyze Screenshot
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      );
    } else if (scanType === 'code') {
      return (
        <div>
          <label className="block mb-2 text-sm font-medium text-spark-gray-200">
            Enter GitHub repository URL to scan
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute -translate-y-1/2 left-3 top-1/2 text-spark-gray-400">
                <Github size={16} />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-spark-dark-700 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-spark-gray-400 outline-none transition-colors ${
                  validationError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-spark-dark-500 focus:border-spark-blue/50'
                }`}
              />
            </div>
            <button
              onClick={handleScan}
              disabled={!input || isScanning}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                !input || isScanning
                  ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                  : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
              }`}
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Scanning...
                </>
              ) : (
                <>
                  Scan
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
          {renderValidationError() || (
            <p className="flex items-center mt-2 text-xs text-spark-gray-300">
              <AlertCircle size={12} className="mr-1 text-spark-gray-400" />
              Repository must be public for scanning
            </p>
          )}
        </div>
      );
    } else if (scanType === 'file') {
      return (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-spark-blue bg-spark-blue/5'
              : validationError
              ? 'border-red-500'
              : 'border-spark-dark-500 hover:border-spark-blue/50'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-spark-gray-300" />
          <h3 className="mb-2 text-lg font-medium">
            Drag and drop your file here
          </h3>
          <p className="mb-4 text-sm text-spark-gray-300">
            or click to browse from your computer
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 transition-colors border rounded-lg cursor-pointer bg-spark-blue/10 hover:bg-spark-blue/20 text-spark-blue border-spark-blue/20"
          >
            Browse Files
          </label>
          {input && (
            <div className="mt-4 text-sm text-spark-gray-200">
              Selected: <span className="font-medium">{input}</span>
              {fileSize && (
                <span className="ml-2 text-spark-gray-400">
                  ({(fileSize / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>
          )}
          {renderValidationError()}

          {/* Add scan button for file uploads */}
          {input && (
            <div className="mt-6">
              <button
                onClick={handleScan}
                disabled={isScanning || !!validationError}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto ${
                  isScanning || validationError
                    ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                    : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan File
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <label className="block mb-2 text-sm font-medium text-spark-gray-200">
            Enter{' '}
            {scanType === 'url'
              ? 'URL'
              : scanType === 'domain'
              ? 'domain name'
              : 'IP address'}{' '}
            to scan
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className={`flex-1 bg-spark-dark-700 border rounded-lg px-4 py-2.5 text-white placeholder-spark-gray-400 outline-none transition-colors ${
                validationError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-spark-dark-500 focus:border-spark-blue/50'
              }`}
            />
            <button
              onClick={handleScan}
              disabled={!input || isScanning}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                !input || isScanning
                  ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                  : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
              }`}
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Scanning...
                </>
              ) : (
                <>
                  Scan
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
          {renderValidationError() ||
            (scanType === 'url' && (
              <p className="flex items-center mt-2 text-xs text-spark-gray-300">
                <AlertCircle size={12} className="mr-1 text-spark-gray-400" />
                Use complete URLs including http:// or https://
              </p>
            ))}
        </div>
      );
    }
  };

  if (showResults) {
    return (
      <ScanResult
        scanData={scanResult}
        scanType={scanType}
        itemName={input}
        onNewScan={resetScan}
      />
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-spark-blue/10">
          <div className="text-spark-blue">{icon}</div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        <p className="max-w-xl mx-auto text-spark-gray-300">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-6 mb-8 glass-card rounded-xl"
      >
        {renderInputSection()}
      </motion.div>

      {isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-block px-6 py-3 rounded-full glass-card">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 border-2 rounded-full border-t-transparent border-spark-blue animate-spin"></div>
              <span className="text-sm">
                {scanType === 'phishing'
                  ? 'Analyzing screenshot for phishing indicators...'
                  : scanType === 'code'
                  ? 'Scanning repository for security vulnerabilities...'
                  : `Scanning ${
                      scanType === 'file' ? 'file' : ''
                    } for threats...`}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
