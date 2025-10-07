import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { courses } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"
import { uploadMiddleware } from "../../uploads/middleware/upload.ts"
import { ImageProcessor } from "../../uploads/services/imageProcessor.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const uploadCourseImageRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses/:id/image', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
      uploadMiddleware,
    ],
    schema: {
      tags: ['courses'],
      summary: 'Upload image for course',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          message: z.string(),
          imageUrl: z.string(),
        }),
        400: z.object({
          error: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { id } = request.params
    const user = getAuthenticatedUserFromRequest(request)
    
    // Verificar se curso existe
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1)

    if (course.length === 0) {
      return reply.status(404).send({ 
        error: 'Curso não encontrado' 
      })
    }

    try {
      const imageProcessor = new ImageProcessor()
      const file = request.uploadedFile
      
      if (!file) {
        return reply.status(400).send({
          error: 'Nenhum arquivo foi enviado'
        })
      }
      
      // Ler buffer do arquivo
      const buffer = await file.toBuffer()
      
      // Processar e fazer upload
      const { url, key } = await imageProcessor.processAndUpload(
        buffer,
        file.filename,
        user.sub
      )

      // Se já existe uma imagem, deletar a antiga
      if (course[0].imageKey) {
        await imageProcessor.deleteImage(course[0].imageKey)
      }

      // Atualizar curso no banco
      await db
        .update(courses)
        .set({
          imageUrl: url,
          imageKey: key,
        })
        .where(eq(courses.id, id))

      return reply.status(200).send({
        message: 'Imagem enviada com sucesso',
        imageUrl: url,
      })

    } catch (error) {
      console.error('Erro ao processar upload:', error)
      return reply.status(500).send({
        error: 'Erro ao processar imagem',
      })
    }
  })
}
