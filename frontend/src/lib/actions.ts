import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

const API_BASE_URL = 'http://localhost:8080'; // Replace with your actual API base URL



export async function scanUrl(url: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/scan/url`, {
            params: { url },
        });
        return response.data;
    } catch (error) {
        console.error('Error scanning URL:', error);
        throw error;
    }
}

export async function scanFile(file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/scan/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Add any other headers you need
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error scanning file:', error);
        throw error;
    }
}

export async function scanDomain(domain: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/scan/domain/${domain}`);
        return response.data;
    } catch (error) {
        console.error('Error scanning domain:', error);
        throw error;
    }
}

export async function scanIp(ip: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/scan/ip/${ip}`);
        return response.data;
    } catch (error) {
        console.error('Error scanning IP:', error);
        throw error;
    }
}

export async function getReport(scanId: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/report/${scanId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting report:', error);
        throw error;
    }
}

export async function getRemediation(threatType: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/remediation`, {
            params: { threat_type: threatType },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting remediation:', error);
        throw error;
    }
}

export async function scanRepo(repoUrl: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/scan-repo`, {
            params: { repoUrl },
        });
        return response.data;
    } catch (error) {
        console.error('Error scanning repo:', error);
        throw error;
    }
}

export async function detectClone(image: File) {
    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await axios.post(`${API_BASE_URL}/detect-clone`, formData, {
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            //     // Add any other headers you need
            // },
        });
        return response.data;
    } catch (error) {
        console.error('Error detecting clone:', error);
        throw error;
    }
}