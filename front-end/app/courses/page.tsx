import { getAllCourses } from "../api/courses-server";
import { getAllCategories } from "../api/categories-server";
import Header from "../componets/header";
import FavoriteButton from "../componets/favorite-button";
import EnrollmentButton from "../componets/enrollment-button";
import SearchFilters from "../componets/search-filters";
import Pagination from "../componets/pagination";
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request";
import { redirect } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds (ISR no server)

interface PageProps {
  searchParams: {
    search?: string;
    categoryId?: string;
    orderBy?: 'title' | 'id';
    sortType?: 'asc' | 'desc';
    page?: string;
  };
}

export default async function Courses({ searchParams }: PageProps) {
  // Busca paralela de dados
  const [result, categoriesResult, user] = await Promise.all([
    getAllCourses({
      search: searchParams.search,
      categoryId: searchParams.categoryId,
      orderBy: searchParams.orderBy || 'title',
      sortType: searchParams.sortType || 'asc',
      page: Number(searchParams.page) || 1,
    }),
    getAllCategories(),
    getAuthenticatedUserFromRequest(),
  ]);
  
  const isManager = user?.role === 'manager';
  const currentPage = Number(searchParams.page) || 1;
  const totalPages = Math.ceil((result?.total || 0) / 4);

  // Se result.courses for undefined/empty, adicione fallback
  if (!result?.courses || result.courses.length === 0) {
    // Se o usuário for manager e não houver filtros ativos, redireciona para criação
    if (isManager && !searchParams.search && !searchParams.categoryId) {
      redirect('/manager-course/create');
    }

    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossos Cursos</h1>
            
            {/* Componente de Pesquisa */}
            <SearchFilters categories={categoriesResult?.categories || []} />
            
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Nenhum curso encontrado</p>
              <p className="text-sm mt-2">Tente ajustar seus filtros de pesquisa</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossos Cursos</h1>
          
          {/* Componente de Pesquisa e Filtros */}
          <SearchFilters categories={categoriesResult?.categories || []} />

          {/* Contador de Resultados */}
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {result.courses.length} de {result.total} curso(s)
          </div>

          {/* Grid de Cursos */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {result.courses.map((course) => (
              <div
                key={course.id}
                className="group relative block overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                {/* Favorite Button */}
                <div className="absolute end-3 top-3 z-10">
                  <FavoriteButton courseId={course.id} />
                </div>

                <a href={`/courses/${course.id}`}>
                  <div className="overflow-hidden rounded-t-xl">
                    <img
                      src={course.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${course.imageUrl}` : 'https://placehold.co/400x300/gray/white?text=Curso+Sem+Imagem'}
                      alt={course.title}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>🧑‍🎓 Inscritos: {course.enrollments}</span>
                        <span>📂 {course.category ? course.category.name : 'Sem categoria'}</span>
                      </div>

                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {course.tags.map((tag) => (
                            <span
                              key={tag.id || tag.name}
                              className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>

                {/* Action Button */}
                <div className="px-5 pb-5">
                  {isManager ? (
                    <a
                      href={`/manager-course/lessons/${course.id}`}
                      className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                    >
                      Gerenciar Aulas
                    </a>
                  ) : (
                    <EnrollmentButton 
                      courseId={course.id} 
                      courseTitle={course.title}
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
}