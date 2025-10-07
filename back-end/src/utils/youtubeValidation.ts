export function validateYouTubeUrl(url: string): { isValid: boolean; videoId?: string; error?: string } {
  // Padrões de URL do YouTube
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return { isValid: true, videoId: match[4] }
    }
  }

  return { 
    isValid: false, 
    error: 'URL do YouTube inválida. Use formatos: youtube.com/watch?v=ID, youtu.be/ID, ou youtube.com/embed/ID' 
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  const result = validateYouTubeUrl(url)
  return result.videoId || null
}

export function generateYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

export function generateYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
