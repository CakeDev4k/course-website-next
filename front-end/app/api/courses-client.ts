import getCookieHeaderClient from '../utils/get-cookie-header-client';
import apiClient from './client';
import { getCourseByIdResponse, putCourseByIdRequest, courseByIdResponse, createCourseData } from './types';

export const getCourseByIdAsClient = async (id: string): Promise<getCourseByIdResponse> => {
  const token = getCookieHeaderClient(); // Client-safe cookie getter

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

export const updateCourseById = async (id: string, data: putCourseByIdRequest): Promise<courseByIdResponse> => {
  const token = getCookieHeaderClient(); // Client-safe cookie getter

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.put<courseByIdResponse>(`/courses/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const createCourse = async (data: createCourseData): Promise<courseByIdResponse> => {
  const token = getCookieHeaderClient(); // Client-safe cookie getter

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.post<courseByIdResponse>(`/courses/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const uploadCourseImage = async (id: string, formData: FormData): Promise<{ imageUrl: string }> => {
  const token = getCookieHeaderClient(); // Client-safe cookie getter

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.post<{ imageUrl: string }>(`/courses/${id}/image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteCourse = async (id: string): Promise<{ message: string }> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.delete<{ message: string }>(`/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};