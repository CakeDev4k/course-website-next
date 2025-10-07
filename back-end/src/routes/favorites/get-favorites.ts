import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { favorites, courses, enrollments } from "../../database/schema.ts"
import { eq, desc, count } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const getFavoritesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/favorites', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['favorites'],
      summary: 'Get user favorites',
      querystring: z.object({
        page: z.coerce.number().optional().default(1),
        limit: z.coerce.number().optional().default(10),
      }),
      response: {
        200: z.object({
          favorites: z.array(
            z.object({
              id: z.string(),
              course: z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().nullable(),
                imageUrl: z.string().nullable(),
              }),
              createdAt: z.date(),
            })
          ),
          total: z.number(),
          page: z.number(),
          totalPages: z.number(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { page, limit } = request.query
    const user = getAuthenticatedUserFromRequest(request)

    try {
      const offset = (page - 1) * limit

      // Buscar favoritos com informações do curso
      const favoritesList = await db
        .select({
          id: favorites.id,
          createdAt: favorites.createdAt,
          course: {
            id: courses.id,
            title: courses.title,
            description: courses.description,
            imageUrl: courses.imageUrl,
          },
        })
        .from(favorites)
        .innerJoin(courses, eq(courses.id, favorites.courseId))
        .where(eq(favorites.userId, user.sub))
        .orderBy(desc(favorites.createdAt))
        .limit(limit)
        .offset(offset)

      // Contar total de favoritos
      const totalResult = await db
        .select({ count: count() })
        .from(favorites)
        .where(eq(favorites.userId, user.sub))

      const total = totalResult[0].count
      const totalPages = Math.ceil(total / limit)

      return reply.status(200).send({
        favorites: favoritesList,
        total,
        page,
        totalPages,
      })

    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
