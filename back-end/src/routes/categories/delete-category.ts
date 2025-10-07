import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { categories } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const deleteCategoryRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/categories/:id', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['categories'],
      summary: 'Delete a category',
      params: z.object({
        id: z.string().uuid(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          error: z.string(),
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
    const { id } = request.params

    try {
      // Verificar se categoria existe
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1)

      if (existingCategory.length === 0) {
        return reply.status(404).send({
          error: 'Categoria não encontrada'
        })
      }

      await db
        .delete(categories)
        .where(eq(categories.id, id))

      return reply.status(200).send({
        message: 'Categoria deletada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}