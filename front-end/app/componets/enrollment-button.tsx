'use client';

import { useState, useEffect } from 'react';
import { checkEnrollment, enrollInCourse } from '../api/enrollments-client';

interface EnrollmentButtonProps {
  courseId: string;
  courseTitle: string;
  className?: string;
  onEnrollmentChange?: (isEnrolled: boolean) => void;
}

export default function EnrollmentButton({ 
  courseId, 
  courseTitle, 
  className = '',
  onEnrollmentChange 
}: EnrollmentButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const status = await checkEnrollment(courseId);
        setIsEnrolled(status.isEnrolled);
        onEnrollmentChange?.(status.isEnrolled);
      } catch (error) {
        console.error('Error checking enrollment status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkEnrollmentStatus();
  }, [courseId, onEnrollmentChange]);

  const handleEnroll = async () => {
    if (isLoading || isChecking || isEnrolled) return;
    
    setIsLoading(true);
    try {
      await enrollInCourse(courseId);
      setIsEnrolled(true);
      onEnrollmentChange?.(true);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`px-4 py-2 text-sm font-medium rounded-md bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        Verificando...
      </button>
    );
  }

  if (isEnrolled) {
    return (
      <button
        disabled
        className={`px-4 py-2 text-sm font-medium rounded-md bg-green-100 text-green-800 cursor-default ${className}`}
      >
        ✓ Inscrito
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Inscrevendo...' : `Inscrever-se em ${courseTitle}`}
    </button>
  );
}
