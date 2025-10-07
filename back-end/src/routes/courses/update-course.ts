import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/clent.ts"
import { courses } from "../../database/schema.ts"
import z from "zod"
import { eq } from "drizzle-orm"
import { checkUserRole } from "../hooks/check-user-role.ts"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"

export const updateCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.put('/courses/:id', {
        preHandler: [
            checkRequestJWT,
            checkUserRole('manager'),
        ],
        schema: {
            tags: ['courses'],
            summary: 'Update a course by id',
            body: z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string(),
            }),
            response: {
                201: z.object({
                    courseId: z.string(),
                }),
                400: z.object({
                    error: z.string(),
                }),
                404: z.null().describe("Course not found"),
                500: z.object({
                    error: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { id, title, description } = request.body

        try {
            const result = await db
                .update(courses)
                .set({ 
                    title, 
                    description 
                })
                .where(eq(courses.id, id))
                .returning()

            if (result.length > 0) {
                return reply.status(201).send({ courseId: result[0].id })
            }

            return reply.status(404).send(null)
        } catch (error) {
            console.error('Erro ao atualizar curso:', error)
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            })
        }
    })
}