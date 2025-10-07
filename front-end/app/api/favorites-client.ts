import getCookieHeaderClient from '../utils/get-cookie-header-client';
import apiClient from './client';
import { FavoritesResponse, FavoriteStatus } from './types';

export const getFavorites = async (page: number = 1, limit: number = 10): Promise<FavoritesResponse> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.get<FavoritesResponse>(`/favorites?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const addFavorite = async (courseId: string): Promise<{ message: string; favorite: any }> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.post(`/courses/${courseId}/favorite`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const removeFavorite = async (courseId: string): Promise<{ message: string }> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.delete(`/courses/${courseId}/favorite`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const checkFavorite = async (courseId: string): Promise<FavoriteStatus> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.get<FavoriteStatus>(`/courses/${courseId}/favorite`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};
