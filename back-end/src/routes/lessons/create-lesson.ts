import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { lessons, courses } from "../../database/schema.ts"
import { eq, desc } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"
import { validateYouTubeUrl } from "../../utils/youtubeValidation.ts"

export const createLessonRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses/:courseId/lessons', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['lessons'],
      summary: 'Create a new lesson for a course',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      body: z.object({
        title: z.string().min(1, 'Título é obrigatório'),
        description: z.string().optional(),
        youtubeUrl: z.string('URL do YouTube é obrigatória'),
      }),
      response: {
        201: z.object({
          lesson: z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().nullable(),
            youtubeUrl: z.string(),
            order: z.number(),
            courseId: z.string(),
            createdAt: z.string(),
          }),
        }),
        204: z.object({
          message: z.string(),
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
    const { courseId } = request.params
    const { title, description, youtubeUrl } = request.body
    const user = getAuthenticatedUserFromRequest(request)

    // Validar URL do YouTube
    const youtubeValidation = validateYouTubeUrl(youtubeUrl)
    if (!youtubeValidation.isValid) {
      return reply.status(400).send({
        error: youtubeValidation.error || 'URL do YouTube inválida'
      })
    }

    try {
      // Verificar se o curso existe
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

      if (course.length === 0) {
        return reply.status(404).send({
          error: 'Curso não encontrado'
        })
      }

      // Pegar a maior ordem atual para este curso
      const lastLesson = await db
        .select({ order: lessons.order })
        .from(lessons)
        .where(eq(lessons.courseId, courseId))
        .orderBy(desc(lessons.order))
        .limit(1)

      const nextOrder = lastLesson.length > 0 ? lastLesson[0].order + 1 : 1

      // Criar a aula
      const [newLesson] = await db
        .insert(lessons)
        .values({
          title,
          description,
          youtubeUrl,
          order: nextOrder,
          courseId,
        })
        .returning()

      return reply.status(201).send({
        lesson: {
          ...newLesson,
          createdAt: newLesson.createdAt.toISOString(),
        },
      })

    } catch (error) {
      console.error('Erro ao criar aula:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
