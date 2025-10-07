'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { getCourseByIdAsClient, updateCourseById, uploadCourseImage } from '@/app/api/courses-client';
import z from 'zod';
import { putCourseByIdRequest } from '@/app/api/types';

const updateCourseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

type UpdateCourseData = z.infer<typeof updateCourseSchema>;

export default function EditCoursePage() {
  const params = useParams();
  const id = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateCourseData>({
    resolver: zodResolver(updateCourseSchema)
  });

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description,
      });
    }
  }, [course, reset]);

  async function fetchCourse() {
    try {
      const {course: fetchedCourse} = await getCourseByIdAsClient(id);
      setCourse(fetchedCourse);
    } catch (err) {
      setError('Curso não encontrado');
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: UpdateCourseData) => {
    setError(null);
    setUpdating(true);

    try {
      const requestData: putCourseByIdRequest = {
        id,
        ...data
      };
      await updateCourseById(id, requestData);

      // Refetch to update local state
      await fetchCourse();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar curso');
    } finally {
      setUpdating(false);
    }
  };

  const clearErrorAndReset = () => {
    setError(null);
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !course) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file); // Backend middleware expects 'file' field via request.file()

    try {
      const res = await uploadCourseImage(id, formData);
      setCourse((prev: any) => ({ ...prev, imageUrl: res.imageUrl }));
      e.target.value = ''; // Reset file input
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-lg text-gray-600">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            href="/manager-course"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para Cursos
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Curso: {course.title}</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Atualizando...' : 'Atualizar Curso'}
            </button>
          </form>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Imagem do Curso</h2>
            <div className="mb-4">
              <img
                src={course.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${course.imageUrl}` : 'https://placehold.co/400x300/gray/white?text=Curso+Sem+Imagem'}
                alt={course.title}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Nova Imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploading && <p className="text-sm text-blue-600 mt-2">Fazendo upload...</p>}
          </div>
        </div>
      </div>
    </>
  );
}