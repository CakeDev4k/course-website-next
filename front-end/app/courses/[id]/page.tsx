import { getCourseById } from '../../api/courses-server';
import { checkEnrollment } from '../../api/enrollments-server';
import Link from 'next/link';
import EnrollmentButton from '../../componets/enrollment-button';
import { getAuthenticatedUserFromRequest } from '../../utils/get-authenticated-user-from-request';

export default async function CoursePage({ params }: { params: { id: string } }) {
    const [{ course }, enrollmentStatus, user] = await Promise.all([
        getCourseById(params.id),
        checkEnrollment(params.id).catch(() => ({ isEnrolled: false, enrollment: null })),
        getAuthenticatedUserFromRequest()
    ]);
    
    const isManager = user?.role === 'manager';

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
                    <p className="text-gray-500">O curso com o ID fornecido não existe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Image and Title */}
            <section className="relative bg-white">
                <img
                    src={course.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${course.imageUrl}` : 'https://placehold.co/400x300/gray/white?text=Curso+Sem+Imagem'}
                    alt={course.title || 'Imagem do curso'}
                    className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Link href="/courses" className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-purple-950 bg-opacity-20 rounded-full hover:bg-opacity-30 transition duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="text-center text-white px-4 w-full max-w-6xl mx-auto relative">
                        <div className="pt-12">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                {course.title || 'Curso Sem Título'}
                            </h1>
                            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                                Descubra um mundo de conhecimento e transforme sua carreira.
                            </p>
                            {isManager ? (
                                <Link 
                                    href={`/manager-course/lessons/${params.id}`}
                                    className="inline-block bg-purple-700 text-white font-bold p-4 m-5 px-12 rounded-full text-lg hover:bg-purple-950 transition duration-300 transform hover:scale-105 shadow-xl"
                                >
                                    Gerenciar Aulas
                                </Link>
                            ) : enrollmentStatus.isEnrolled ? (
                                <Link 
                                    href={`/courses/${params.id}/lessons`}
                                    className="inline-block bg-purple-700 text-white font-bold p-4 m-5 px-12 rounded-full text-lg hover:bg-purple-950 transition duration-300 transform hover:scale-105 shadow-xl"
                                >
                                    Ver Aulas do Curso
                                </Link>
                            ) : (
                                <EnrollmentButton 
                                    courseId={params.id}
                                    courseTitle={course.title}
                                    className="inline-block bg-purple-700 text-white font-bold p-4 m-5 px-12 rounded-full text-lg hover:bg-purple-950 transition duration-300 transform hover:scale-105 shadow-xl"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="prose prose-lg max-w-none">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sobre o Curso</h2>
                    <div className="bg-gray-50 rounded-lg p-8 mb-8">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {course.description || 'Descrição não disponível.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Por Que Escolher Este Curso?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-md text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Conteúdo Atualizado</h3>
                            <p className="text-gray-600">Aulas práticas e atualizadas com as melhores práticas do mercado.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👨‍🏫</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instrutores Experientes</h3>
                            <p className="text-gray-600">Profissionais renomados com anos de experiência na área.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificado Reconhecido</h3>
                            <p className="text-gray-600">Ganhe um certificado válido para impulsionar seu currículo.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">O Que Nossos Alunos Dizem</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <p className="text-gray-600 italic mb-4">"Este curso mudou completamente minha visão sobre o tema. Altamente recomendado!"</p>
                        <div className="flex items-center">
                            <img src="/placeholder-avatar.jpg" alt="Aluno" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-gray-900">Maria Silva</p>
                                <p className="text-sm text-gray-500">Desenvolvedora Sênior</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <p className="text-gray-600 italic mb-4">"Conteúdo prático e direto ao ponto. Já apliquei o que aprendi no meu trabalho."</p>
                        <div className="flex items-center">
                            <img src="/placeholder-avatar-2.jpg" alt="Aluno" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-gray-900">João Santos</p>
                                <p className="text-sm text-gray-500">Gerente de Projetos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-blue-600 py-16 px-4 sm:px-6 lg:px-8 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Começar Sua Jornada?</h2>
                    <p className="text-xl mb-8">Não perca tempo! Inscreva-se agora e dê o primeiro passo para o sucesso.</p>
                    {isManager ? (
                        <Link 
                            href={`/manager-course/lessons/${params.id}`}
                            className="inline-block bg-white text-blue-600 font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-xl"
                        >
                            Gerenciar Aulas
                        </Link>
                    ) : enrollmentStatus.isEnrolled ? (
                        <Link 
                            href={`/courses/${params.id}/lessons`}
                            className="inline-block bg-white text-blue-600 font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-xl"
                        >
                            Começar a Estudar
                        </Link>
                    ) : (
                        <EnrollmentButton 
                            courseId={params.id}
                            courseTitle={course.title}
                            className="inline-block bg-white text-blue-600 font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-xl"
                        />
                    )}
                </div>
            </section>
        </div>
    );
}