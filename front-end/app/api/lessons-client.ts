import getCookieHeaderClient from '../utils/get-cookie-header-client';
import apiClient from './client';
import { 
  LessonsResponse, 
  CreateLessonData, 
  CreateLessonResponse, 
  MarkLessonWatchedData, 
  MarkLessonWatchedResponse,
  CourseProgress,
  UpdateLessonData,
  UpdateLessonResponse,
  DeleteLessonResponse
} from './types';

export const getLessonsByCourseId = async (courseId: string): Promise<LessonsResponse | null> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }


  try {
    const response = await apiClient.get<LessonsResponse>(`/courses/${courseId}/lessons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
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

export const createLesson = async (courseId: string, data: CreateLessonData): Promise<CreateLessonResponse> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.post<CreateLessonResponse>(`/courses/${courseId}/lessons`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const markLessonWatched = async (lessonId: string, data: MarkLessonWatchedData): Promise<MarkLessonWatchedResponse> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.post<MarkLessonWatchedResponse>(`/lessons/${lessonId}/watched`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const getCourseProgress = async (courseId: string): Promise<CourseProgress | null> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  try {
    const response = await apiClient.get<CourseProgress>(`/courses/${courseId}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error: any) {
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

export const updateLesson = async (lessonId: string, data: UpdateLessonData): Promise<UpdateLessonResponse> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.put<UpdateLessonResponse>(`/lessons/${lessonId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const deleteLesson = async (lessonId: string): Promise<DeleteLessonResponse> => {
  const token = getCookieHeaderClient();

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.');
  }

  const response = await apiClient.delete<DeleteLessonResponse>(`/lessons/${lessonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};
