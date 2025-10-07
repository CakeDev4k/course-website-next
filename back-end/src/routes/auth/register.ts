// Ricardo36@gmail.com // 123123

import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/clent.ts"
import { users } from "../../database/schema.ts"
import z from "zod"
import { hash } from "argon2"
import jwt from 'jsonwebtoken'
import { eq } from "drizzle-orm"

export const registerRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/register/', {
        schema: {
            tags: ['auth'],
            summary: 'Register',
            body: z.object({
                name: z.string(),
                email: z.email(),
                password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
                role: z.enum(['student', 'manager']).default('student'),
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
    try {
        const { name, email, password, role } = request.body

        // Verificar se o email já existe
        const existingUser = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (existingUser.length > 0) {
            console.log(`Registration attempt with existing email: ${email}`)
            return reply.status(400).send({ message: 'Este email já está em uso.' })
        }

        // Criar o usuário
        const result = await db
            .insert(users)
            .values({
                name,
                email,
                password: await hash(`${password}`),
                role
            })
            .returning()

        const user = result[0]

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

        console.log(`User registered successfully: ${user.id}`)

        return reply.status(200).send({ 
            token
 })
    } catch (error) {
        console.error('Error during registration:', error)
        return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
})
}