import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { lessons, lessonProgress, courses } from "../../database/schema.ts"
import { eq, asc } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"
import { extractYouTubeVideoId, generateYouTubeEmbedUrl, generateYouTubeThumbnailUrl } from "../../utils/youtubeValidation.ts"

export const getLessonsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:courseId/lessons', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['lessons'],
      summary: 'Get all lessons from a course',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      response: {
        200: z.object({
          lessons: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              youtubeUrl: z.string(),
              embedUrl: z.string(),
              thumbnailUrl: z.string(),
              order: z.number(),
              watched: z.boolean(),
              watchedAt: z.string().nullable(),
              createdAt: z.string(),
            })
          ),
        }),
        204: z.object({
          message: z.string(),
        }),
        404: z.object({
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
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

      if (course.length === 0) {
        return reply.status(404).send({
          error: 'Curso não encontrado'
        })
      }

      // Buscar aulas do curso ordenadas por ordem
      const lessonsList = await db
        .select({
          id: lessons.id,
          title: lessons.title,
          description: lessons.description,
          youtubeUrl: lessons.youtubeUrl,
          order: lessons.order,
          createdAt: lessons.createdAt,
        })
        .from(lessons)
        .where(eq(lessons.courseId, courseId))
        .orderBy(asc(lessons.order))

      if (lessonsList.length === 0) {
        return reply.status(204).send({
          message: 'Nenhuma aula encontrada para este curso'
        })
      }

      // Buscar progresso do usuário para estas aulas
      const progressList = await db
        .select({
          lessonId: lessonProgress.lessonId,
          watched: lessonProgress.watched,
          watchedAt: lessonProgress.watchedAt,
        })
        .from(lessonProgress)
        .where(eq(lessonProgress.userId, user.sub))

      // Criar mapa de progresso
      const progressMap = new Map()
      progressList.forEach(progress => {
        progressMap.set(progress.lessonId, {
          watched: progress.watched,
          watchedAt: progress.watchedAt,
        })
      })

      // Enriquecer aulas com informações do YouTube e progresso
      const enrichedLessons = lessonsList.map(lesson => {
        const videoId = extractYouTubeVideoId(lesson.youtubeUrl)
        const progress = progressMap.get(lesson.id) || { watched: false, watchedAt: null }

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          youtubeUrl: lesson.youtubeUrl,
          embedUrl: videoId ? generateYouTubeEmbedUrl(videoId) : '',
          thumbnailUrl: videoId ? generateYouTubeThumbnailUrl(videoId) : '',
          order: lesson.order,
          watched: progress.watched,
          watchedAt: progress.watchedAt ? progress.watchedAt.toISOString() : null,
          createdAt: lesson.createdAt.toISOString(),
        }
      })

      return reply.status(200).send({
        lessons: enrichedLessons,
      })
    } catch (error) {
      console.error('Erro ao buscar aulas:', error)
      return reply.status(404).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}