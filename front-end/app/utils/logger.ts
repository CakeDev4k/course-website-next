// Utilitário para logging minimalista no frontend

export const logRequest = (method: string, url: string) => {
  console.log(`→ ${method} ${url}`);
};

export const logError = (message: string, error?: any) => {
  console.error(`❌ ${message}`, error);
};

export const logSuccess = (message: string) => {
  console.log(`✅ ${message}`);
};
