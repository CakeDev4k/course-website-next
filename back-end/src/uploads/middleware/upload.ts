import type { FastifyReply, FastifyRequest } from "fastify";
import type { MultipartFile } from '@fastify/multipart'

declare module 'fastify' {
  interface FastifyRequest {
    uploadedFile?: MultipartFile
  }
}

export async function uploadMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = await request.file()
    
    if (!data) {
      return reply.status(400).send({ 
        error: 'Nenhum arquivo foi enviado' 
      })
    }

    // Validar tipo de arquivo
    if (!data.mimetype.startsWith('image/')) {
      return reply.status(400).send({ 
        error: 'Apenas arquivos de imagem são permitidos' 
      })
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (data.file.bytesRead > maxSize) {
      return reply.status(400).send({ 
        error: 'Arquivo muito grande. Máximo 5MB' 
      })
    }

    // Validar extensão
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']
    const extension = data.filename.split('.').pop()?.toLowerCase()
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return reply.status(400).send({ 
        error: 'Formato de arquivo não suportado. Use: jpg, jpeg, png, webp' 
      })
    }

    // Adicionar arquivo ao request
    request.uploadedFile = data

  } catch (error) {
    return reply.status(500).send({ 
      error: 'Erro ao processar upload' 
    })
  }
}
