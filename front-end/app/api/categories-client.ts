import apiClient from './client';
import getCookieHeaderClient from '../utils/get-cookie-header-client';

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export const getCategories = async (): Promise<CategoriesResponse> => {
  const token = getCookieHeaderClient();

  if (!token) {
    return { categories: [] };
  }

  try {
    const response = await apiClient.get<CategoriesResponse>('/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return { categories: [] };
  }
};