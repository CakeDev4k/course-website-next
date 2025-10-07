import { headers } from 'next/headers';
import Link from 'next/link';
import LogoutButton from './logoutButton';
import ManagerCourseButton from './managerCourseButton';

export default async function Header() {
    // Lê os headers customizados no server-side (disponíveis após middleware)
    const header = await headers();

    const userName = header.get('x-user-name') || 'Guest';
    const userRole = header.get('x-user-role') || 'student';

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Space Courses</h1>
        
                    <div className="flex items-center space-x-4">
                        {/* Exibe role como badge */}
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${userRole === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : userRole === 'manager'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </span>

                        {/* Navegação */}
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/courses"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Cursos
                            </Link>
                            <Link
                                href="/favorites"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Favoritos
                            </Link>
                        </div>

                        {/* Botão para gerenciar cursos, visível apenas para manager */}
                        {userRole === 'manager' && (
                            // Componente client-side que oculta o botão quando já estamos em /manager-course
                            <>
                                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                                <ManagerCourseButton />
                            </>
                        )}

                        {/* Nome do usuário */}
                        <span className="text-sm font-medium text-gray-700">
                            Olá, {userName}!
                        </span>

                        {/* Botão de logout ou menu, opcional - adicione onClick se client-side necessário */}
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}