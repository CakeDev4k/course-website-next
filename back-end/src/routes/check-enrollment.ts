import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../database/clent.ts"
import { enrollments } from "../database/schema.ts"
import { eq, and } from "drizzle-orm"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts"

export const checkEnrollmentRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:courseId/enrollment', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['enrollments'],
      summary: 'Check if user is enrolled in course',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      response: {
        200: z.object({
          isEnrolled: z.boolean(),
          enrollment: z.object({
            id: z.string(),
            createdAt: z.date(),
          }).nullable(),
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
      // Verificar se está inscrito
      const enrollment = await db
        .select({
          id: enrollments.id,
          createdAt: enrollments.createdAt,
        })
        .from(enrollments)
        .where(and(
          eq(enrollments.courseId, courseId),
          eq(enrollments.userId, user.sub)
        ))
        .limit(1)

      const isEnrolled = enrollment.length > 0

      return reply.status(200).send({
        isEnrolled,
        enrollment: isEnrolled ? enrollment[0] : null,
      })

    } catch (error) {
      console.error('Erro ao verificar inscrição:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
