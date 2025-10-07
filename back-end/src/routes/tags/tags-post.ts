import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { tags } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const tagsPostRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/tags', {
    preHandler: [checkRequestJWT, checkUserRole('manager')],
    schema: {
      tags: ['tags'],
      summary: 'Create a new tag',
      body: z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido').optional(),
      }),
      response: {
        201: z.object({
          tag: z.object({
            id: z.string(),
            name: z.string(),
            color: z.string().nullable(),
            createdAt: z.date(),
          }),
        }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() })
      },
    },
  }, async (request, reply) => {
    const { name, color } = request.body
    try {
      const existingTag = await db.select().from(tags).where(eq(tags.name, name)).limit(1)
      if (existingTag.length > 0) {
        return reply.status(400).send({ error: 'Já existe uma tag com este nome' })
      }
      const [newTag] = await db.insert(tags).values({ name, color }).returning()
      return reply.status(201).send({ tag: newTag })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
