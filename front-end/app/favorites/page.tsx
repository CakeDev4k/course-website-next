import { getFavorites } from "../api/favorites-server";
import Header from "../componets/header";
import Link from "next/link";
import FavoriteCard from "./components/favorite-card";

export const revalidate = 60;

export default async function FavoritesPage() {
  try {
    const result = await getFavorites(1, 20);

    return (
      <>
        <Header />
        
        <div className="min-h-screen bg-gray-50">
          {/* Header Section */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
                  <p className="text-gray-600 mt-1">
                    {result.total} curso{result.total !== 1 ? 's' : ''} favorito{result.total !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Explorar Cursos
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {result.favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum favorito ainda</h3>
                <p className="text-gray-500 mb-6">Comece explorando nossos cursos e adicione seus favoritos!</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Explorar Cursos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {result.favorites.map((favorite) => (
                  <FavoriteCard key={favorite.id} favorite={favorite} />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading favorites:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar favoritos</h1>
          <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar seus favoritos.</p>
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
