import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { favorites, courses } from "../../database/schema.ts"
import { eq, and } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const addFavoriteRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses/:courseId/favorite', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['favorites'],
      summary: 'Add course to favorites',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      response: {
        201: z.object({
          message: z.string(),
          favorite: z.object({
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

      // Verificar se já está nos favoritos
      const existingFavorite = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.courseId, courseId),
          eq(favorites.userId, user.sub)
        ))
        .limit(1)

      if (existingFavorite.length > 0) {
        return reply.status(400).send({
          error: 'Curso já está nos favoritos'
        })
      }

      // Adicionar aos favoritos
      const [newFavorite] = await db
        .insert(favorites)
        .values({
          userId: user.sub,
          courseId,
        })
        .returning()

      return reply.status(201).send({
        message: 'Curso adicionado aos favoritos',
        favorite: {
          id: newFavorite.id,
          courseId: newFavorite.courseId,
          createdAt: newFavorite.createdAt.toISOString(),
        },
      })

    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
