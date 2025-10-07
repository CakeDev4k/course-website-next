import axios from 'axios';
import { logRequest } from '../utils/logger';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite envio de cookies em requisições CORS
});

// Interceptor para logging minimalista das requisições
apiClient.interceptors.request.use((config) => {
  logRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '');
  return config;
});

export default apiClient;