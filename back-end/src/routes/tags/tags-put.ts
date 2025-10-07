import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { tags } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const tagsPutRoute: FastifyPluginAsyncZod = async (server) => {
  server.put('/tags/:id', {
    preHandler: [checkRequestJWT, checkUserRole('manager')],
    schema: {
      tags: ['tags'],
      summary: 'Update a tag',
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        name: z.string().min(1, 'Nome é obrigatório').optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido').optional(),
      }),
      response: {
        200: z.object({
          tag: z.object({
            id: z.string(),
            name: z.string(),
            color: z.string().nullable(),
            createdAt: z.date(),
          }),
        }),
        404: z.object({ error: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() })
      },
    },
  }, async (request, reply) => {
    const { id } = request.params
    const { name, color } = request.body
    try {
      const existingTag = await db.select().from(tags).where(eq(tags.id, id)).limit(1)
      if (existingTag.length === 0) {
        return reply.status(404).send({ error: 'Tag não encontrada' })
      }
      if (name && name !== existingTag[0].name) {
        const duplicateTag = await db.select().from(tags).where(eq(tags.name, name)).limit(1)
        if (duplicateTag.length > 0) {
          return reply.status(400).send({ error: 'Já existe uma tag com este nome' })
        }
      }
      const [updatedTag] = await db.update(tags).set({ name: name || existingTag[0].name, color }).where(eq(tags.id, id)).returning()
      return reply.status(200).send({ tag: updatedTag })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
