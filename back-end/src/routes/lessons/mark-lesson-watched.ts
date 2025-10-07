import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { lessonProgress, lessons, courses } from "../../database/schema.ts"
import { eq, and } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const markLessonWatchedRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/lessons/:lessonId/watched', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['lessons'],
      summary: 'Mark lesson as watched',
      params: z.object({
        lessonId: z.string().uuid(),
      }),
      body: z.object({
        watched: z.boolean().default(true),
      }),
      response: {
        200: z.object({
          message: z.string(),
          progress: z.object({
            id: z.string(),
            lessonId: z.string(),
            watched: z.boolean(),
            watchedAt: z.date().nullable(),
          }),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        })
      },
    },
  }, async (request, reply) => {
    const { lessonId } = request.params
    const { watched } = request.body
    const user = getAuthenticatedUserFromRequest(request)

    try {
      // Verificar se a aula existe e se o curso existe
      const lessonWithCourse = await db
        .select({
          lessonId: lessons.id,
          courseId: lessons.courseId,
        })
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(eq(lessons.id, lessonId))
        .limit(1)

      if (lessonWithCourse.length === 0) {
        return reply.status(404).send({
          error: 'Aula não encontrada ou curso não existe'
        })
      }

      // Verificar se já existe progresso para esta aula
      const existingProgress = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.lessonId, lessonId),
            eq(lessonProgress.userId, user.sub)
          )
        )
        .limit(1)

      let progress

      if (existingProgress.length > 0) {
        // Atualizar progresso existente
        [progress] = await db
          .update(lessonProgress)
          .set({
            watched,
            watchedAt: watched ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(lessonProgress.id, existingProgress[0].id))
          .returning()
      } else {
        // Criar novo progresso
        [progress] = await db
          .insert(lessonProgress)
          .values({
            userId: user.sub,
            lessonId,
            watched,
            watchedAt: watched ? new Date() : null,
          })
          .returning()
      }

      return reply.status(200).send({
        message: watched ? 'Aula marcada como assistida' : 'Aula marcada como não assistida',
        progress: {
          id: progress.id,
          lessonId: progress.lessonId,
          watched: progress.watched,
          watchedAt: progress.watchedAt,
        },
      })

    } catch (error) {
      console.error('Erro ao marcar aula como assistida:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
