import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { favorites } from "../../database/schema.ts"
import { eq, and } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const checkFavoriteRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:courseId/favorite', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['favorites'],
      summary: 'Check if course is in favorites',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      response: {
        200: z.object({
          isFavorite: z.boolean(),
          favorite: z.object({
            id: z.string(),
            createdAt: z.date(),
          }).nullable(),
        }),
        400: z.object({
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
      // Verificar se está nos favoritos
      const favorite = await db
        .select({
          id: favorites.id,
          createdAt: favorites.createdAt,
        })
        .from(favorites)
        .where(and(
          eq(favorites.courseId, courseId),
          eq(favorites.userId, user.sub)
        ))
        .limit(1)

      const isFavorite = favorite.length > 0

      return reply.status(200).send({
        isFavorite,
        favorite: isFavorite ? favorite[0] : null,
      })

    } catch (error) {
      console.error('Erro ao verificar favorito:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
