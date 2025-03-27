import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ValidationPatterns, ScanType } from './types';

export const VALIDATION_PATTERNS: ValidationPatterns = {
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  domain: /^([\da-z](?:[\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/i,
  ipv4: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  githubRepo: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
};

export const validateInput = (
  input: string,
  scanType: ScanType,
  selectedFile?: File | null,
  fileSize?: number | null,
  fileType?: string | null
): { isValid: boolean; error: string | null } => {
  // Clear previous errors
  if (!input && scanType !== 'file' && scanType !== 'phishing') {
    return { isValid: false, error: 'Please provide a valid input' };
  }

  switch (scanType) {
    case 'url':
      if (!VALIDATION_PATTERNS.url.test(input)) {
        return {
          isValid: false,
          error: 'Please enter a valid URL (e.g., https://example.com)'
        };
      }
      break;

    case 'domain':
      if (!VALIDATION_PATTERNS.domain.test(input)) {
        return {
          isValid: false,
          error: 'Please enter a valid domain name (e.g., example.com)'
        };
      }
      break;

    case 'ip':
      const isValidIpv4 = VALIDATION_PATTERNS.ipv4.test(input);
      const isValidIpv6 = VALIDATION_PATTERNS.ipv6.test(input);

      if (!isValidIpv4 && !isValidIpv6) {
        return {
          isValid: false,
          error: 'Please enter a valid IP address'
        };
      }
      break;

    case 'code':
      if (!VALIDATION_PATTERNS.githubRepo.test(input)) {
        return {
          isValid: false,
          error: 'Please enter a valid GitHub repository URL'
        };
      }
      break;

    case 'file':
    case 'phishing':
      if (!selectedFile) {
        return {
          isValid: false,
          error: `Please select a ${scanType === 'file' ? 'file' : 'screenshot'} to scan`
        };
      }

      const MAX_FILE_SIZE = scanType === 'phishing'
        ? 10 * 1024 * 1024   // 10MB for screenshots
        : 50 * 1024 * 1024;  // 50MB for files

      if (fileSize && fileSize > MAX_FILE_SIZE) {
        return {
          isValid: false,
          error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        };
      }

      if (scanType === 'phishing') {
        const VALID_IMAGE_TYPES = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp'
        ];

        if (!fileType || !VALID_IMAGE_TYPES.includes(fileType)) {
          return {
            isValid: false,
            error: 'Please select a valid image file (JPEG, PNG, GIF, WebP)'
          };
        }
      }
      break;
  }

  return { isValid: true, error: null };
};
