import getCookieHeaderClient from '../utils/get-cookie-header-client';
import apiClient from './client';
import { Enrollment, EnrollmentStatus } from './types';

export const enrollInCourse = async (courseId: string): Promise<{ message: string; enrollment: Enrollment }> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.post(`/courses/${courseId}/enroll`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const checkEnrollment = async (courseId: string): Promise<EnrollmentStatus> => {
  const token = getCookieHeaderClient();

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
