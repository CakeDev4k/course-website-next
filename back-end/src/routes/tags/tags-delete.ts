import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { tags } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const tagsDeleteRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/tags/:id', {
    preHandler: [checkRequestJWT, checkUserRole('manager')],
    schema: {
      tags: ['tags'],
      summary: 'Delete a tag',
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({ message: z.string() }),
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() })
      },
    },
  }, async (request, reply) => {
    const { id } = request.params
    try {
      const existingTag = await db.select().from(tags).where(eq(tags.id, id)).limit(1)
      if (existingTag.length === 0) {
        return reply.status(404).send({ error: 'Tag não encontrada' })
      }
      await db.delete(tags).where(eq(tags.id, id))
      return reply.status(200).send({ message: 'Tag deletada com sucesso' })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
