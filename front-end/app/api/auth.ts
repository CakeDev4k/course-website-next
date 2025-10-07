import apiClient from './client';
import { LoginFormData, RegisterFormData, AuthResponse, ErrorResponse } from './types';
import { setCookie, deleteCookie } from 'cookies-next';

const COOKIE_EXPIRATION_SECONDS = 604800; // 7 dias

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/sessions/', data);
  
  if (typeof window !== 'undefined') {
    // Armazenar token no cookie com expiração (client-side)
    setCookie('token', response.data.token, {
      maxAge: COOKIE_EXPIRATION_SECONDS,
      path: '/',
      secure: true,
      sameSite: 'strict'
    });
  }

  return response.data;
};

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/register/', data);
  
  if (typeof window !== 'undefined') {
    // Armazenar token no cookie com expiração (client-side)
    setCookie('token', response.data.token, {
      maxAge: COOKIE_EXPIRATION_SECONDS,
      path: '/',
      secure: true,
      sameSite: 'strict'
    });
  }

  return response.data;
};

export const logout = async () => {
    // Limpar token do cookie (client-side)
    await deleteCookie('token', {
      path: '/'
    });
};