// api/categories-server.ts
import getCookieHeader from '../utils/get-cookie-header-server';
import apiClient from './client';

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface CategoriesResponse {
  categories: Category[];
}

interface CategoryByIdResponse {
  category: Category;
}

/**
 * Busca todas as categorias disponíveis
 */
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const token = await getCookieHeader();
  
  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
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

/**
 * Busca uma categoria específica por ID
 */
export const getCategoryById = async (id: string): Promise<CategoryByIdResponse> => {
  const token = await getCookieHeader();
  
  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.get<CategoryByIdResponse>(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};