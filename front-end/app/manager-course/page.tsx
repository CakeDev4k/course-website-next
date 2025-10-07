import { getAllCourses } from "../api/courses-server";
import Link from "next/link";
import Header from "../componets/header";

export const revalidate = 60; // Revalidate every 60 seconds (ISR no server)

export default async function Courses() {
  const result = await getAllCourses();

  if (!result?.courses || result.courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Nenhum curso encontrado.
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossos Cursos</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {result.courses.map((course) => (
              <div
                key={course.id}
                className="group relative block overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                {/* Action Buttons */}
                <div className="absolute end-3 top-3 z-10 flex space-x-2">
                  <Link href={`/manager-course/lessons/${course.id}`}>
                    <button className="rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-900 transition hover:bg-white hover:text-green-500 shadow-sm" title="Gerenciar aulas">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </button>
                  </Link>
                  <Link href={`/manager-course/edit/${course.id}`}>
                    <button className="rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-900 transition hover:bg-white hover:text-blue-500 shadow-sm" title="Editar curso">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>

                {/* Card Content - Removido o <a> wrapper */}
                <div className="block">
                  <Link href={`/courses/${course.id}`} className="block">
                    <div className="overflow-hidden rounded-t-xl">
                      <img
                        src={course.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${course.imageUrl}` : 'https://placehold.co/400x300/gray/white?text=Curso+Sem+Imagem'}
                        alt={course.title}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link href={`/courses/${course.id}`}>
                      <h3 className="mt-2 text-2xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                    </Link>

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

                      {/* Quick Actions */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/manager-course/lessons/${course.id}`}
                            className="flex-1 text-center px-3 py-2 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                          >
                            📚 Aulas
                          </Link>
                          <Link 
                            href={`/courses/${course.id}/lessons`}
                            className="flex-1 text-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            👀 Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="group relative block overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-dashed border-gray-500">
              <Link
                href={`/manager-course/create`}
                className="flex flex-col justify-center items-center h-full p-10 text-center text-gray-400 hover:text-purple-600 transition-colors"
              >
                NOVO CURSO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}