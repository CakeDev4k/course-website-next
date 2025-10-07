import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { categories } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const createCategoryRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/categories', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['categories'],
      summary: 'Create a new category',
      body: z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido').optional(),
      }),
      response: {
        201: z.object({
          category: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            color: z.string().nullable(),
            createdAt: z.date(),
          }),
        }),
        400: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { name, description, color } = request.body

    try {
      // Verificar se já existe categoria com este nome
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1)

      if (existingCategory.length > 0) {
        return reply.status(400).send({
          error: 'Já existe uma categoria com este nome'
        })
      }

      const [newCategory] = await db
        .insert(categories)
        .values({
          name,
          description,
          color,
        })
        .returning()

      return reply.status(201).send({
        category: newCategory,
      })
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      return reply.status(400).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}