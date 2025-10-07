import getCookieHeaderServer from '../utils/get-cookie-header-server';
import apiClient from './client';
import { EnrollmentStatus } from './types';

export const checkEnrollment = async (courseId: string): Promise<EnrollmentStatus> => {
  const token = await getCookieHeaderServer();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.get<EnrollmentStatus>(`/courses/${courseId}/enrollment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};
