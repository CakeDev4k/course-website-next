import { getCourseById } from "../../../api/courses-server";
import { getLessonsByCourseId } from "../../../api/lessons-server";
import { getAuthenticatedUserFromRequest } from "../../../utils/get-authenticated-user-from-request";
import { redirect } from "next/navigation";
import Link from "next/link";
import LessonManagementPageClient from "./lesson-management-page-client";
import Header from "@/app/componets/header";

interface LessonManagementPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60;

export default async function LessonManagementPage({ params }: LessonManagementPageProps) {
  try {
    const [courseResult, user] = await Promise.all([
      getCourseById(params.id),
      getAuthenticatedUserFromRequest(),
    ]);

    // Verificar se o usuário é manager
    if (!user || user.role !== 'manager') {
      redirect('/courses');
    }

    const course = courseResult.course;

    let lessonsResult;
    try {
      lessonsResult = await getLessonsByCourseId(params.id);
    } catch (error: any) {
      // Check if course doesn't exist
      if (error.message === 'COURSE_NOT_FOUND') {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
              <p className="text-gray-600 mb-4">O curso que você está procurando não existe ou foi removido.</p>
              <Link
                href="/manager-course"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Voltar para gerenciamento
              </Link>
            </div>
          </div>
        );
      }
      throw error;
    }

    // Handle case where course exists but has no lessons (204 response)
    const lessons = lessonsResult !== null ? lessonsResult.lessons : [];

    if (!course) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
            <Link
              href="/manager-course"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Voltar para gerenciamento
            </Link>
          </div>
        </div>
      );
    }

    return (

      <>
        <Header />
        <LessonManagementPageClient
          course={course}
          lessons={lessons}
          courseId={params.id}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading lesson management:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar gerenciamento</h1>
          <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar o gerenciamento de aulas.</p>
          <Link
            href="/manager-course"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voltar para gerenciamento
          </Link>
        </div>
      </div>
    );
  }
}