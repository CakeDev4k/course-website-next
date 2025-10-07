'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { createCourse } from '@/app/api/courses-client';
import { getCategories, Category } from '@/app/api/categories-client';
import z from 'zod';

const createCourseSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    categoryId: z.string().optional(),
});

type createCourseData = z.infer<typeof createCourseSchema>;

export default function CreateCoursePage() {
    const router = useRouter();

    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<createCourseData>({
        resolver: zodResolver(createCourseSchema)
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories();
                setCategories(result.categories || []);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const onSubmit = async (data: createCourseData) => {
        setError(null);
        setUpdating(true);

        try {
            // Se categoryId estiver vazio, não envie para a API
            const courseData = {
                ...data,
                categoryId: data.categoryId && data.categoryId !== "" ? data.categoryId : undefined
            };
            
            const { courseId } = await createCourse(courseData);
            router.push(`/manager-course/lessons/${courseId}`);
        } catch (err) {
            console.error('Error creating course:', err);
            setError('Erro ao criar curso. Tente novamente.');
        } finally {
            setUpdating(false);
        }
    };

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

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Criar Curso: </h1>

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

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                Categoria
                            </label>
                            <select
                                id="categoryId"
                                {...register('categoryId')}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoadingCategories}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {isLoadingCategories && <p className="mt-1 text-sm text-gray-500">Carregando categorias...</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? 'Criando...' : 'Criar Curso'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}