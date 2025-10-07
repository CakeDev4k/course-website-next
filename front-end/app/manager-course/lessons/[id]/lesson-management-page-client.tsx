'use client';

import { useState } from 'react';
import Link from "next/link";
import Header from "../../../componets/header";
import LessonManagementCard from "./components/lesson-management-card";
import CreateLessonForm from "./components/create-lesson-form";
import DeleteCourseModal from "./components/delete-course-modal";
import { Lesson } from "../../../api/types";

interface Course {
  id: string;
  title: string;
  description: string;
}

interface LessonManagementPageClientProps {
  course: Course;
  lessons: Lesson[];
  courseId: string;
}

export default function LessonManagementPageClient({ 
  course, 
  lessons, 
  courseId 
}: LessonManagementPageClientProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/manager-course"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar ao gerenciamento
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                  <p className="text-gray-600">Gerenciar aulas do curso</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  href={`/courses/${courseId}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Ver como aluno
                </Link>
                <Link
                  href={`/manager-course/edit/${courseId}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Editar curso
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Course Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Curso</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
                      <div className="text-sm text-gray-600">Total de Aulas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {lessons.filter(l => l.watched).length}
                      </div>
                      <div className="text-sm text-gray-600">Aulas Assistidas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {lessons.length > 0 ? Math.round((lessons.filter(l => l.watched).length / lessons.length) * 100) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Taxa de Conclusão</div>
                    </div>
                  </div>
                </div>

                {/* Create Lesson Form */}
                <CreateLessonForm courseId={courseId} />

                {/* Lessons List */}
                {lessons.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aula criada</h3>
                    <p className="text-gray-500">Use o formulário acima para criar a primeira aula deste curso.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Aulas do Curso ({lessons.length})
                    </h2>
                    
                    <div className="space-y-4">
                      {lessons.map((lesson, index) => (
                        <LessonManagementCard 
                          key={lesson.id} 
                          lesson={lesson} 
                          lessonNumber={index + 1}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Course Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Curso</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Título:</span>
                      <p className="text-sm text-gray-900">{course.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Descrição:</span>
                      <p className="text-sm text-gray-900 mt-1">{course.description}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <Link
                      href={`/courses/${courseId}`}
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Ver Curso
                    </Link>
                    <Link
                      href={`/courses/${courseId}/lessons`}
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                    >
                      Ver Aulas
                    </Link>
                    <Link
                      href={`/manager-course/edit/${courseId}`}
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                    >
                      Editar Curso
                    </Link>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Deletar Curso
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteCourseModal
        courseId={courseId}
        courseTitle={course.title}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
