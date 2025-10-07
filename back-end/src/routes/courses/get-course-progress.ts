import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { lessons, lessonProgress, courses } from "../../database/schema.ts"
import { eq, count, and, desc } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const getCourseProgressRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:courseId/progress', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['progress'],
      summary: 'Get user progress for a course',
      params: z.object({
        courseId: z.string(),
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.string(),
            title: z.string(),
          }),
          progress: z.object({
            totalLessons: z.number(),
            watchedLessons: z.number(),
            percentage: z.number(),
            lastWatchedAt: z.string().nullable(),
          }),
        }),
        204: z.object({
          message: z.string(),
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
    const user = getAuthenticatedUserFromRequest(request)

    try {
      // Verificar se o curso existe
      const course = await db
        .select({
          id: courses.id,
          title: courses.title,
        })
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

      if (course.length === 0) {
        return reply.status(404).send({
          error: 'Curso não encontrado'
        })
      }

      // Contar total de aulas do curso
      const totalLessonsResult = await db
        .select({ count: count() })
        .from(lessons)
        .where(eq(lessons.courseId, courseId))

      const totalLessons = totalLessonsResult[0].count

      if (totalLessons === 0) {
        return reply.status(204).send({
          message: 'Nenhuma aula encontrada para este curso'
        })
      }

      // Buscar aulas assistidas pelo usuário (apenas count)
      const watchedLessonsResult = await db
        .select({
          count: count(),
        })
        .from(lessonProgress)
        .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
        .where(and(
          eq(lessons.courseId, courseId),
          eq(lessonProgress.userId, user.sub),
          eq(lessonProgress.watched, true)
        ))

      const watchedLessons = watchedLessonsResult[0].count
      const percentage = Math.round((watchedLessons / totalLessons) * 100)

      // Buscar última aula assistida (query separada)
      const lastWatchedResult = await db
        .select({
          watchedAt: lessonProgress.watchedAt,
        })
        .from(lessonProgress)
        .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
        .where(and(
          eq(lessons.courseId, courseId),
          eq(lessonProgress.userId, user.sub),
          eq(lessonProgress.watched, true)
        ))
        .orderBy(desc(lessonProgress.watchedAt))
        .limit(1)

      return reply.status(200).send({
        course: course[0],
        progress: {
          totalLessons,
          watchedLessons,
          percentage,
          lastWatchedAt: lastWatchedResult.length > 0 ? lastWatchedResult[0].watchedAt?.toISOString() || null : null,
        },
      })
    } catch (error) {
      console.error('Erro ao buscar progresso:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}