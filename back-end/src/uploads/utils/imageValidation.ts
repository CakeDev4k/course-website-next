import { createHash } from 'crypto'

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  dimensions?: { width: number; height: number }
}

export function validateImage(
  buffer: Buffer,
  mimetype: string
): ImageValidationResult {
  // Validar mimetype
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedMimes.includes(mimetype)) {
    return { isValid: false, error: 'Tipo de arquivo não suportado' }
  }

  // Validar tamanho mínimo (1KB)
  if (buffer.length < 1024) {
    return { isValid: false, error: 'Arquivo muito pequeno' }
  }

  return { isValid: true }
}

export function generateImageKey(filename: string, userId: string): string {
  const timestamp = Date.now()
  const hash = createHash('md5')
    .update(`${filename}${timestamp}${userId}`)
    .digest('hex')
  
  return `courses/${userId}/${timestamp}-${hash}`
}
