// ./app/utils/getCookieHeader.ts
'use client';

const getCookieHeaderClient = (): string | null => {
  // Client-side: Parse document.cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const token = getCookie('token');

  return token;
};

export default getCookieHeaderClient;