// src/components/Scanner.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Upload,
  Github,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

import {
  scanUrl,
  scanDomain,
  scanIp,
  scanRepo,
  scanFile,
  detectClone,
} from '../lib/actions';
import { ScannerProps, ScanType } from '@/lib/types';
import { validateInput } from '@/lib/utils';
import { ScanResult } from './ScanResult';

export const Scanner: React.FC<ScannerProps> = ({
  title,
  description,
  icon,
  placeholder,
  scanType,
}) => {
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{
    file: File | null;
    size: number | null;
    type: string | null;
  }>({ file: null, size: null, type: null });

  // Reset validation error when input changes
  useEffect(() => {
    setValidationError(null);
  }, [input, fileMetadata.file]);

  const handleScan = async () => {
    const { isValid, error } = validateInput(
      input,
      scanType,
      fileMetadata.file,
      fileMetadata.size,
      fileMetadata.type
    );

    if (!isValid) {
      setValidationError(error);
      return;
    }

    setIsProcessing(true);

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
          if (fileMetadata.file) {
            response = await scanFile(fileMetadata.file);
          }
          break;
        case 'phishing':
          if (fileMetadata.file) {
            response = await detectClone(fileMetadata.file);
          }
          break;
      }

      setScanResult(response);
      setShowResults(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during the scan';
      setValidationError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setInput(file.name);
      setFileMetadata({
        file,
        size: file.size,
        type: file.type,
      });
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
      setFileMetadata({
        file,
        size: file.size,
        type: file.type,
      });
    }
  };

  const renderProcessingOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-spark-dark-700 p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6">
        <motion.div
          animate={{
            rotate: 360,
            transition: {
              repeat: Infinity,
              duration: 1,
              ease: 'linear',
            },
          }}
        >
          <Loader2 className="w-16 h-16 text-spark-blue animate-pulse" />
        </motion.div>
        <p className="text-white text-xl font-semibold text-center">
          {getScanningMessage(scanType, input)}
        </p>
      </div>
    </motion.div>
  );

  const getScanningMessage = (type: ScanType, input: string) => {
    switch (type) {
      case 'phishing':
        return 'Analyzing screenshot for phishing indicators...';
      case 'code':
        return 'Scanning repository for security vulnerabilities...';
      case 'file':
        return 'Scanning file for potential threats...';
      default:
        return `Scanning ${input} for threats...`;
    }
  };

  const renderInputSection = () => {
    if (scanType === 'phishing' || scanType === 'file') {
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
          {scanType === 'phishing' ? (
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-spark-gray-300" />
          ) : (
            <Upload className="w-12 h-12 mx-auto mb-4 text-spark-gray-300" />
          )}

          <h3 className="mb-2 text-lg font-medium">
            {scanType === 'phishing'
              ? 'Upload a screenshot of the suspicious website'
              : 'Drag and drop your file here'}
          </h3>

          <p className="mb-4 text-sm text-spark-gray-300">
            {scanType === 'phishing'
              ? 'Our AI will analyze the screenshot for phishing indicators'
              : 'or click to browse from your computer'}
          </p>

          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={scanType === 'phishing' ? 'image/*' : '*'}
            onChange={handleFileChange}
          />

          <label
            htmlFor="file-upload"
            className="px-4 py-2 transition-colors border rounded-lg cursor-pointer bg-spark-blue/10 hover:bg-spark-blue/20 text-spark-blue border-spark-blue/20"
          >
            Browse {scanType === 'phishing' ? 'Screenshots' : 'Files'}
          </label>

          {input && (
            <div className="mt-4 text-sm text-spark-gray-200">
              Selected: <span className="font-medium">{input}</span>
              {fileMetadata.size && (
                <span className="ml-2 text-spark-gray-400">
                  ({(fileMetadata.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>
          )}

          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-sm text-red-500"
            >
              <AlertCircle size={14} className="mr-1" />
              {validationError}
            </motion.div>
          )}

          {input && (
            <div className="mt-6">
              <button
                onClick={handleScan}
                disabled={isProcessing || !!validationError}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto ${
                  isProcessing || validationError
                    ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                    : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan {scanType === 'phishing' ? 'Screenshot' : 'File'}
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
              disabled={!input || isProcessing}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                !input || isProcessing
                  ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                  : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
              }`}
            >
              {isProcessing ? (
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
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-sm text-red-500"
            >
              <AlertCircle size={14} className="mr-1" />
              {validationError}
            </motion.div>
          )}
          <p className="flex items-center mt-2 text-xs text-spark-gray-300">
            <AlertCircle size={12} className="mr-1 text-spark-gray-400" />
            Repository must be public for scanning
          </p>
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
              className={`flex-1 bg-spark-dark-700 border rounded-lg px-2 py-2.5 text-white placeholder-spark-gray-400 outline-none transition-colors ${
                validationError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-spark-dark-500 focus:border-spark-blue/50'
              }`}
            />
            <button
              onClick={handleScan}
              disabled={!input || isProcessing}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                !input || isProcessing
                  ? 'bg-spark-dark-500 text-spark-gray-300 cursor-not-allowed'
                  : 'bg-spark-blue text-white hover:bg-spark-blue-dark'
              }`}
            >
              {isProcessing ? (
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
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-sm text-red-500"
            >
              <AlertCircle size={14} className="mr-1" />
              {validationError}
            </motion.div>
          )}
          {scanType === 'url' && (
            <p className="flex items-center mt-2 text-xs text-spark-gray-300">
              <AlertCircle size={12} className="mr-1 text-spark-gray-400" />
              Use complete URLs including http:// or https://
            </p>
          )}
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
        onNewScan={() => {
          setShowResults(false);
          setInput('');
          setFileMetadata({ file: null, size: null, type: null });
        }}
      />
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence>
        {isProcessing && renderProcessingOverlay()}
      </AnimatePresence>

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
        className="p-4 md:p-6 mb-8 glass-card rounded-xl"
      >
        {renderInputSection()}
      </motion.div>
    </div>
  );
};
