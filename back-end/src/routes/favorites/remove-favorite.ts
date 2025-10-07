import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { favorites } from "../../database/schema.ts"
import { eq, and } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const removeFavoriteRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/courses/:courseId/favorite', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['favorites'],
      summary: 'Remove course from favorites',
      params: z.object({
        courseId: z.string().uuid(),
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
        })
      },
    },
  }, async (request, reply) => {
    const { courseId } = request.params
    const user = getAuthenticatedUserFromRequest(request)

    try {
      // Verificar se está nos favoritos
      const existingFavorite = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.courseId, courseId),
          eq(favorites.userId, user.sub)
        ))
        .limit(1)

      if (existingFavorite.length === 0) {
        return reply.status(404).send({
          error: 'Curso não está nos favoritos'
        })
      }

      // Remover dos favoritos
      await db
        .delete(favorites)
        .where(and(
          eq(favorites.courseId, courseId),
          eq(favorites.userId, user.sub)
        ))

      return reply.status(200).send({
        message: 'Curso removido dos favoritos',
      })

    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
