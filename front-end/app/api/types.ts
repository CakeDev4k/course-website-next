import { z } from 'zod';

// Zod schemas for validation
export const LoginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['student', 'manager']).default('student'),
});

// TypeScript interfaces inferred from Zod schemas
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

// API response types
export interface AuthResponse {
  code: number;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ErrorResponse {
  message: string;
}

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Courses = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  enrollments: number;
  isFavorite: boolean;
  category: Category;
  tags: Tag[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type createCourseData = {
  title: string;
  description: string;
};

export type putCourseByIdRequest = {
  id: string;
  title: string;
  description: string;
}

export type courseByIdResponse = {
  courseId: string;
}

export type getCourseByIdResponse = {
  course: Course;
};

export type CoursesResponse = {
  courses: Courses[];
  total: number;
};

// Lesson types
export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  order: number;
  watched: boolean;
  watchedAt: string | null;
  createdAt: Date;
};

export type LessonsResponse = {
  lessons: Lesson[];
};

export type CreateLessonData = {
  title: string;
  description?: string;
  youtubeUrl: string;
};

export type CreateLessonResponse = {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    youtubeUrl: string;
    order: number;
    courseId: string;
    createdAt: string;
  };
};

export type MarkLessonWatchedData = {
  watched: boolean;
};

export type MarkLessonWatchedResponse = {
  message: string;
  progress: {
    id: string;
    lessonId: string;
    watched: boolean;
    watchedAt: Date | null;
  };
};

export type CourseProgress = {
  course: {
    id: string;
    title: string;
  };
  progress: {
    totalLessons: number;
    watchedLessons: number;
    percentage: number;
    lastWatchedAt: string | null;
  };
};

// Favorites types
export type Favorite = {
  id: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
  };
  createdAt: Date;
};

export type FavoritesResponse = {
  favorites: Favorite[];
  total: number;
  page: number;
  totalPages: number;
};

export type FavoriteStatus = {
  isFavorite: boolean;
  favorite: {
    id: string;
    createdAt: Date;
  } | null;
};

// Enrollment types
export type Enrollment = {
  id: string;
  courseId: string;
  createdAt: string;
};

export type EnrollmentStatus = {
  isEnrolled: boolean;
  enrollment: {
    id: string;
    createdAt: Date;
  } | null;
};

// Lesson management types
export type UpdateLessonData = {
  title?: string;
  description?: string;
  youtubeUrl?: string;
  order?: number;
};

export type UpdateLessonResponse = {
  message: string;
  lesson: {
    id: string;
    title: string;
    description: string | null;
    youtubeUrl: string;
    order: number;
    courseId: string;
    updatedAt: string;
  };
};

export type DeleteLessonResponse = {
  message: string;
};