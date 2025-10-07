import getCookieHeaderServer from '../utils/get-cookie-header-server';
import apiClient from './client';
import { LessonsResponse, CourseProgress } from './types';
import { logError } from '../utils/logger';

export const getLessonsByCourseId = async (courseId: string): Promise<LessonsResponse | null> => {
  try {
    const token = await getCookieHeaderServer();

    if (!token) {
      throw new Error('Token não encontrado. Usuário não autenticado.');
    }


    const response = await apiClient.get<LessonsResponse>(`/courses/${courseId}/lessons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle 204 response (course exists but no lessons)
    if (response.status === 204) {
      return null; // Return null to indicate course exists but has no lessons
    }

    return response.data;
  } catch (error: any) {
    logError('Error in getLessonsByCourseId', error);

    // Handle 204 response (course exists but no lessons)
    if (error.response && error.response.status === 204) {
      return null; // Return null to indicate course exists but has no lessons
    }

    // Handle 404 response (course doesn't exist)
    if (error.response && error.response.status === 404) {
      throw new Error('COURSE_NOT_FOUND');
    }

    throw error;
  }
};

export const getCourseProgress = async (courseId: string): Promise<CourseProgress | null> => {
  try {
    const token = await getCookieHeaderServer();

    if (!token) {
      throw new Error('Token não encontrado. Usuário não autenticado.');
    }

    const response = await apiClient.get<CourseProgress>(`/courses/${courseId}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    logError('Error in getCourseProgress', error);

    // Handle 204 response (course exists but no lessons)
    if (error.response && error.response.status === 204) {
      return null; // Return null to indicate course exists but has no lessons
    }

    // Handle 404 response (course doesn't exist)
    if (error.response && error.response.status === 404) {
      throw new Error('COURSE_NOT_FOUND');
    }

    throw error;
  }
};

export const getCourseProgressUniversal = async (courseId: string): Promise<CourseProgress | any> => {
  try {
    const token = await getCookieHeaderServer();

    if (!token) {
      throw new Error('Token não encontrado. Usuário não autenticado.');
    }

    const response = await apiClient.get<CourseProgress>(`/courses/${courseId}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    // Se a resposta for vazia ou não existir dados, retornar objeto padrão
    if (!response.data ||
      (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
      return {
        course: { id: courseId, title: 'Curso' },
        progress: { totalLessons: 0, watchedLessons: 0, percentage: 0, lastWatchedAt: null }
      };
    }

    return response.data;
  } catch (error: any) {
    // Se for erro 404 (não encontrado, possivelmente vazio), retornar objeto padrão
    if (error.response && error.response.status === 404) {
      return {
        course: { id: courseId, title: 'Curso' },
        progress: { totalLessons: 0, watchedLessons: 0, percentage: 0, lastWatchedAt: null }
      };
    }
    // Para outros erros, propagar
    const errorData = error.response?.data || {};
    throw new Error(errorData.error || `HTTP error! status: ${error.response?.status || 'unknown'}`);
  }
};