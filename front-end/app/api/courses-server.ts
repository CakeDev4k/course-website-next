import getCookieHeader from '../utils/get-cookie-header-server';
import apiClient from './client';
import { CoursesResponse, Course, getCourseByIdResponse } from './types';

interface GetAllCoursesParams {
  search?: string;
  categoryId?: string;
  orderBy?: 'title' | 'id';
  sortType?: 'asc' | 'desc';
  page?: number;
}

export const getAllCourses = async (params: GetAllCoursesParams = {}): Promise<CoursesResponse> => {
  const token = await getCookieHeader();
  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params.orderBy) queryParams.append('orderBy', params.orderBy);
  if (params.sortType) queryParams.append('sortType', params.sortType);
  if (params.page) queryParams.append('page', params.page.toString());

  const response = await apiClient.get<CoursesResponse>(
    `/courses?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCourseById = async (id: string): Promise<getCourseByIdResponse> => {
  const token = await getCookieHeader(); // Server-safe async cookie getter

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.get<getCourseByIdResponse>(`/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};