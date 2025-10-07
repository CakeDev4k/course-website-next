import Link from 'next/link';
import { Favorite } from '../../api/types';
import FavoriteButton from '../../componets/favorite-button';

interface FavoriteCardProps {
  favorite: Favorite;
}

export default function FavoriteCard({ favorite }: FavoriteCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative block overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton courseId={favorite.course.id} />
      </div>

      <Link href={`/courses/${favorite.course.id}`}>
        <div className="overflow-hidden rounded-t-xl">
          <img
            src={favorite.course.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${favorite.course.imageUrl}` : 'https://placehold.co/400x300/gray/white?text=Curso+Sem+Imagem'}
            alt={favorite.course.title}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="p-5">
          <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {favorite.course.title}
          </h3>

          <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {favorite.course.description}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Adicionado em {formatDate(favorite.createdAt)}</span>
              <span className="text-blue-600 hover:text-blue-800">Ver curso →</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
