import React from 'react';
import { motion } from 'framer-motion';

interface ScannerLoaderProps {
  scanType: 'file' | 'url' | 'domain' | 'ip' | 'code' | 'phishing';
}

export const ScannerLoader: React.FC<ScannerLoaderProps> = ({ scanType }) => {
  const loaderTexts = {
    'url': 'Scanning web URL for potential threats...',
    'domain': 'Analyzing domain reputation...',
    'ip': 'Investigating IP address security...',
    'code': 'Deep scanning repository for vulnerabilities...',
    'file': 'Performing comprehensive file analysis...',
    'phishing': 'AI detecting phishing indicators...'
  };

  const getLoaderText = () => loaderTexts[scanType] || 'Scanning in progress...';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-spark-dark-900/70 backdrop-blur-sm"
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto mb-6 w-24 h-24"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-full h-full text-spark-blue"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="280"
              initial={{ strokeDashoffset: 280 }}
              animate={{
                strokeDashoffset: 0,
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="opacity-30"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="280"
              initial={{ strokeDashoffset: 280 }}
              animate={{
                strokeDashoffset: 0,
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="opacity-100"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-medium text-white"
        >
          {getLoaderText()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-sm text-spark-gray-300"
        >
          This might take a few moments...
        </motion.div>
      </div>
    </motion.div>
  );
};
