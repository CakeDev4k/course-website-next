import getCookieHeaderServer from '../utils/get-cookie-header-server';
import apiClient from './client';
import { FavoritesResponse, FavoriteStatus } from './types';

export const getFavorites = async (page: number = 1, limit: number = 10): Promise<FavoritesResponse> => {
  const token = await getCookieHeaderServer();

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

export const checkFavorite = async (courseId: string): Promise<FavoriteStatus> => {
  const token = await getCookieHeaderServer();

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
