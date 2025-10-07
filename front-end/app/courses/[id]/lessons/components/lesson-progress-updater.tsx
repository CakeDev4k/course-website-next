'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LessonProgressUpdaterProps {
  shouldRefresh: boolean;
}

export default function LessonProgressUpdater({ shouldRefresh }: LessonProgressUpdaterProps) {
  const router = useRouter();

  useEffect(() => {
    if (shouldRefresh) {
      router.refresh();
    }
  }, [shouldRefresh, router]);

  return null;
}
