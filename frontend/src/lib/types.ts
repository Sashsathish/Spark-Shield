// src/types/scanner.ts
import { ReactNode } from 'react';

export type ScanType = 'file' | 'url' | 'domain' | 'ip' | 'code' | 'phishing';

export interface ScannerProps {
    title: string;
    description: string;
    icon: ReactNode;
    placeholder: string;
    scanType: ScanType;
}

export interface ScanResultProps {
    scanData: any;
    scanType: ScanType;
    itemName: string;
    onNewScan: () => void;
}

export interface ScanResult {
    status: 'safe' | 'risky' | 'malicious';
    details: string;
    confidence: number;
    recommendations?: string[];
}

export interface ValidationPatterns {
    url: RegExp;
    domain: RegExp;
    ipv4: RegExp;
    ipv6: RegExp;
    githubRepo: RegExp;
}