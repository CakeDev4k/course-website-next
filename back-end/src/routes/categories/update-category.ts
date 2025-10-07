import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { categories } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const updateCategoryRoute: FastifyPluginAsyncZod = async (server) => {
  server.put('/categories/:id', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['categories'],
      summary: 'Update a category',
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        name: z.string().min(1, 'Nome é obrigatório').optional(),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido').optional(),
      }),
      response: {
        200: z.object({
          category: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            color: z.string().nullable(),
            updatedAt: z.date(),
          }),
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
    const { name, description, color } = request.body

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

      // Se mudou o nome, verificar se já existe outro com este nome
      if (name && name !== existingCategory[0].name) {
        const duplicateCategory = await db
          .select()
          .from(categories)
          .where(eq(categories.name, name))
          .limit(1)

        if (duplicateCategory.length > 0) {
          return reply.status(400).send({
            error: 'Já existe uma categoria com este nome'
          })
        }
      }

      const [updatedCategory] = await db
        .update(categories)
        .set({
          name: name || existingCategory[0].name,
          description,
          color,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning()

      return reply.status(200).send({
        category: updatedCategory,
      })
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}