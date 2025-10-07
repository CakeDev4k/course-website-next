'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson } from '../../../../api/types';
import { markLessonWatched } from '../../../../api/lessons-client';

interface LessonCardProps {
  lesson: Lesson;
  lessonNumber: number;
  courseId: string;
}

export default function LessonCard({ lesson, lessonNumber, courseId }: LessonCardProps) {
  const router = useRouter();
  const [isWatched, setIsWatched] = useState(lesson.watched);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleMarkWatched = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await markLessonWatched(lesson.id, { watched: !isWatched });
      setIsWatched(!isWatched);
      // Refresh the page to update progress
      router.refresh();
    } catch (error) {
      console.error('Error marking lesson as watched:', error);
      // Could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Lesson Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isWatched 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {lessonNumber}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {lesson.title}
                </h3>
                {lesson.description && (
                  <p className="text-gray-600 mt-1">{lesson.description}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isWatched && lesson.watchedAt && (
              <span className="text-xs text-gray-500">
                Assistida em {formatDuration(new Date(lesson.watchedAt))}
              </span>
            )}
            <button
              onClick={handleMarkWatched}
              disabled={isLoading}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isWatched
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? '...' : isWatched ? '✓ Assistida' : 'Marcar como assistida'}
            </button>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="border-t border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Vídeo da aula</h4>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showVideo ? 'Ocultar vídeo' : 'Mostrar vídeo'}
            </button>
          </div>
          
          {showVideo ? (
            <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
              {lesson.embedUrl ? (
                <iframe
                  src={lesson.embedUrl}
                  title={lesson.title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Vídeo não disponível</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              {lesson.thumbnailUrl ? (
                <img
                  src={lesson.thumbnailUrl}
                  alt={lesson.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-200">
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-200">
                  <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {/* YouTube Link */}
          <div className="mt-3">
            <a
              href={lesson.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Assistir no YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
