import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { lessons, courses } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"
import { validateYouTubeUrl } from "../../utils/youtubeValidation.ts"

export const updateLessonRoute: FastifyPluginAsyncZod = async (server) => {
  server.put('/lessons/:lessonId', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['lessons'],
      summary: 'Update a lesson',
      params: z.object({
        lessonId: z.string().uuid(),
      }),
      body: z.object({
        title: z.string().min(1, 'Título é obrigatório').optional(),
        description: z.string().optional(),
        youtubeUrl: z.string().optional(),
        order: z.number().optional(),
      }),
      response: {
        200: z.object({
          message: z.string(),
          lesson: z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().nullable(),
            youtubeUrl: z.string(),
            order: z.number(),
            courseId: z.string(),
            updatedAt: z.string(),
          }),
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
    const { lessonId } = request.params
    const { title, description, youtubeUrl, order } = request.body
    const user = getAuthenticatedUserFromRequest(request)

    try {
      // Verificar se a aula existe e se o curso existe
      const existingLessonWithCourse = await db
        .select({
          lessonId: lessons.id,
          courseId: lessons.courseId,
        })
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(eq(lessons.id, lessonId))
        .limit(1)

      if (existingLessonWithCourse.length === 0) {
        return reply.status(404).send({
          error: 'Aula não encontrada ou curso não existe'
        })
      }

      // Validar URL do YouTube se fornecida
      if (youtubeUrl) {
        const youtubeValidation = validateYouTubeUrl(youtubeUrl)
        if (!youtubeValidation.isValid) {
          return reply.status(400).send({
            error: youtubeValidation.error || 'URL do YouTube inválida'
          })
        }
      }

      // Preparar dados para atualização
      const updateData: any = {
        updatedAt: new Date(),
      }

      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl
      if (order !== undefined) updateData.order = order

      // Atualizar a aula
      const [updatedLesson] = await db
        .update(lessons)
        .set(updateData)
        .where(eq(lessons.id, lessonId))
        .returning()

      return reply.status(200).send({
        message: 'Aula atualizada com sucesso',
        lesson: {
          id: updatedLesson.id,
          title: updatedLesson.title,
          description: updatedLesson.description,
          youtubeUrl: updatedLesson.youtubeUrl,
          order: updatedLesson.order,
          courseId: updatedLesson.courseId,
          updatedAt: updatedLesson.updatedAt.toISOString(),
        },
      })

    } catch (error) {
      console.error('Erro ao atualizar aula:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
