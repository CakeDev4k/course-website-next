// Ricardo36@gmail.com // 123123

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/clent.ts"
import { users } from "../../database/schema.ts"
import { eq } from "drizzle-orm"
import z from "zod"
import { verify } from 'argon2'
import jwt from 'jsonwebtoken'

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/sessions/', {
        schema: {
            tags: ['auth'],
            summary: 'Login',
            body: z.object({
                email: z.email(),
                password: z.string(),
            }),
            response: {
                200: z.object({
                    token: z.string(),
                }),
                400: z.object({message: z.string()}),
                500: z.object({message: z.string()}),
            }
        },
    }, async (request, reply) => {
    const { email, password } = request.body

    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email,email))

        if(result.length === 0){
            console.log(`Login attempt with non-existent email: ${email}`)
            return reply.status(400).send({ message: 'Credenciais inválidas.'})
        }

        const user = result[0]

        const doesPasswordsMatch = await verify(user.password, password)

        if(!doesPasswordsMatch){
            console.log(`Login attempt with incorrect password for user: ${user.id}`)
            return reply.status(400).send({ message: 'Credenciais inválidas.'})
        }

        const token = jwt.sign(
            {
                sub: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET ?? 'secret',
            {
                expiresIn: '7d',
            }
        )

        console.log(`User logged in successfully: ${user.id}`)

        return reply.status(200).send({ 
            token
        })
    } catch (error) {
        console.error('Error during login:', error)
        return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
})
}