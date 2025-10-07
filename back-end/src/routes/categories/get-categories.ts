import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { categories } from "../../database/schema.ts"
import { desc } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"

export const getCategoriesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/categories', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['categories'],
      summary: 'Get all categories',
      response: {
        200: z.object({
          categories: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              color: z.string().nullable(),
              createdAt: z.date(),
            })
          ),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const categoriesList = await db
        .select()
        .from(categories)
        .orderBy(desc(categories.createdAt))

      return reply.status(200).send({
        categories: categoriesList,
      })
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}