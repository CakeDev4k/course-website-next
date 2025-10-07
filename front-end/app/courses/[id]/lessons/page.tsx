import { getCourseById } from "../../../api/courses-server";
import { getLessonsByCourseId } from "../../../api/lessons-server";
import { getCourseProgress } from "../../../api/lessons-server";
import { checkEnrollment } from "../../../api/enrollments-server";
import { redirect } from 'next/navigation';
import Header from "../../../componets/header";
import Link from "next/link";
import LessonCard from "./components/lesson-card";
import ProgressCard from "./components/progress-card";
import CreateLessonForm from "./components/create-lesson-form";
import { getAuthenticatedUserFromRequest } from "../../../utils/get-authenticated-user-from-request";
import EnrollmentButton from "../../../componets/enrollment-button";

interface LessonsPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function LessonsPage({ params }: LessonsPageProps) {
  try {
    const [courseResult, user, enrollmentStatus] = await Promise.all([
      getCourseById(params.id),
      getAuthenticatedUserFromRequest(),
      checkEnrollment(params.id).catch(() => ({ isEnrolled: false, enrollment: null }))
    ]);

    const course = courseResult.course;
    const isManager = user?.role === 'manager';

    // Se não for manager e não estiver inscrito, mostrar mensagem de inscrição
    if (!isManager && !enrollmentStatus.isEnrolled) {
      return (
        <>
          <Header />
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Inscreva-se no Curso</h1>
              <p className="text-gray-500 mb-6">Você precisa se inscrever neste curso para acessar as aulas.</p>
              <EnrollmentButton 
                courseId={params.id}
                courseTitle={course.title}
                className="w-full"
              />
              <Link 
                href={`/courses/${params.id}`}
                className="block mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                Voltar ao curso
              </Link>
            </div>
          </div>
        </>
      );
    }

    if (!course) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
            <Link 
              href="/courses" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Voltar para cursos
            </Link>
          </div>
        </div>
      );
    }

    // Tentar buscar aulas e progresso
    let lessonsResult;
    let progressResult;
    
    try {
      [lessonsResult, progressResult] = await Promise.all([
        getLessonsByCourseId(params.id),
        getCourseProgress(params.id),
      ]);
    } catch (error: any) {
      console.error('Error fetching lessons or progress:', error);
      
      // Check if course doesn't exist
      if (error.message === 'COURSE_NOT_FOUND') {
        return (
          <>
            <Header />
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
                  href="/courses" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Voltar para cursos
                </Link>
              </div>
            </div>
          </>
        );
      }
      
      // Se for manager, sempre redirecionar para página de gerenciamento em caso de erro
      if (isManager) {
        redirect(`/manager-course/lessons/${params.id}`);
      }
      
      // Para estudantes, mostrar erro
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro de autenticação</h1>
            <p className="text-gray-600 mb-4">Não foi possível carregar as aulas. Faça login novamente.</p>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Fazer login
            </Link>
          </div>
        </div>
      );
    }

    // Handle case where course exists but has no lessons (204 response)
    const hasLessons = lessonsResult !== null;
    const hasProgress = progressResult !== null;
    
    const lessons = hasLessons ? lessonsResult!.lessons : [];
    const progress = hasProgress ? progressResult!.progress : {
      totalLessons: 0,
      watchedLessons: 0,
      percentage: 0,
      lastWatchedAt: null
    };

    // Se for manager, sempre redirecionar para página de gerenciamento (com ou sem aulas)
    if (isManager) {
      redirect(`/manager-course/lessons/${params.id}`);
    }

    return (
      <>
        <Header />
        
        <div className="min-h-screen bg-gray-50">
          {/* Header Section */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link 
                    href={`/courses/${params.id}`}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar ao curso
                  </Link>
                  <div className="h-6 w-px bg-gray-300" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                    <p className="text-gray-600">Aulas do curso</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Progresso do curso</div>
                  <div className="text-2xl font-bold text-blue-600">{progress.percentage}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {!hasLessons ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aula disponível</h3>
                      <p className="text-gray-500">
                        {isManager 
                          ? 'Este curso ainda não possui aulas. Adicione a primeira aula abaixo!'
                          : 'Este curso ainda não possui aulas. Volte em breve!'
                        }
                      </p>
                    </div>
                    
                    {isManager && (
                      <CreateLessonForm 
                        courseId={params.id}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Aulas ({lessons.length})
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      {isManager && (
                        <CreateLessonForm 
                          courseId={params.id}
                        />
                      )}
                      
                      {lessons.map((lesson, index) => (
                        <LessonCard 
                          key={lesson.id} 
                          lesson={lesson} 
                          lessonNumber={index + 1}
                          courseId={params.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Progress Card */}
                  <ProgressCard progress={progress} />
                  
                  {/* Course Info */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o curso</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar aulas</h1>
          <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar as aulas deste curso.</p>
          <Link 
            href="/courses" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voltar para cursos
          </Link>
        </div>
      </div>
    );
  }
}