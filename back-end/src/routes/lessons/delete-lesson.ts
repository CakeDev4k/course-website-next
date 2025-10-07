import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { lessons, lessonProgress, courses } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const deleteLessonRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/lessons/:lessonId', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['lessons'],
      summary: 'Delete a lesson',
      params: z.object({
        lessonId: z.string().uuid(),
      }),
      response: {
        200: z.object({
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
    const { lessonId } = request.params
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

      // Deletar progresso relacionado primeiro
      await db
        .delete(lessonProgress)
        .where(eq(lessonProgress.lessonId, lessonId))

      // Deletar a aula
      await db
        .delete(lessons)
        .where(eq(lessons.id, lessonId))

      return reply.status(200).send({
        message: 'Aula deletada com sucesso',
      })

    } catch (error) {
      console.error('Erro ao deletar aula:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
