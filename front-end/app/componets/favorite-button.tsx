'use client';

import { useState, useEffect } from 'react';
import { checkFavorite, addFavorite, removeFavorite } from '../api/favorites-client';

interface FavoriteButtonProps {
  courseId: string;
  className?: string;
}

export default function FavoriteButton({ courseId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const status = await checkFavorite(courseId);
        setIsFavorite(status.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [courseId]);

  const handleToggleFavorite = async () => {
    if (isLoading || isChecking) return;
    
    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(courseId);
        setIsFavorite(false);
      } else {
        await addFavorite(courseId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-900 shadow-sm ${className}`}
      >
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-900 transition hover:bg-white hover:text-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
