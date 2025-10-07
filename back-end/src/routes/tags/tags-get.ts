import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { tags } from "../../database/schema.ts"
import { desc } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"

export const tagsGetRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/tags', {
    preHandler: [checkRequestJWT],
    schema: {
      tags: ['tags'],
      summary: 'Get all tags',
      response: {
        200: z.object({
          tags: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              color: z.string().nullable(),
              createdAt: z.date(),
            })
          ),
        }),
        500: z.object({ error: z.string() })
      },
    },
  }, async (request, reply) => {
    try {
      const tagsList = await db.select().from(tags).orderBy(desc(tags.createdAt))
      return reply.status(200).send({ tags: tagsList })
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
