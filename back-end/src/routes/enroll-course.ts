import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../database/clent.ts"
import { enrollments, courses } from "../database/schema.ts"
import { eq, and } from "drizzle-orm"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts"

export const enrollCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses/:courseId/enroll', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['enrollments'],
      summary: 'Enroll in a course',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      response: {
        201: z.object({
          message: z.string(),
          enrollment: z.object({
            id: z.string(),
            courseId: z.string(),
            createdAt: z.string(),
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

      // Verificar se já está inscrito
      const existingEnrollment = await db
        .select()
        .from(enrollments)
        .where(and(
          eq(enrollments.courseId, courseId),
          eq(enrollments.userId, user.sub)
        ))
        .limit(1)

      if (existingEnrollment.length > 0) {
        return reply.status(400).send({
          error: 'Você já está inscrito neste curso'
        })
      }

      // Fazer inscrição
      const [newEnrollment] = await db
        .insert(enrollments)
        .values({
          userId: user.sub,
          courseId,
        })
        .returning()

      return reply.status(201).send({
        message: 'Inscrição realizada com sucesso',
        enrollment: {
          id: newEnrollment.id,
          courseId: newEnrollment.courseId,
          createdAt: newEnrollment.createdAt.toISOString(),
        },
      })

    } catch (error) {
      console.error('Erro ao se inscrever no curso:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
