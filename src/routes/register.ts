// Ricardo36@gmail.com // 123123

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/clent.ts"
import { users } from "../database/schema.ts"
import z from "zod"
import { hash } from "argon2"

export const registerRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/register/', {
        schema: {
            tags: ['auth'],
            summary: 'Register',
            body: z.object({
                name: z.string(),
                email: z.email(),
                password: z.string(),
            }),
            response: {
                200: z.object({userId: z.string()}),
                400: z.object({message: z.string()}),
            }
        },
    }, async (request, reply) => {
    const { name ,email, password } = request.body

    const result = await db
        .insert(users)
        .values({
            name,
            email,
            password: await hash(`${password}`)
        })
        .returning()

    return reply.status(200).send({ userId: result[0].id })
})
}