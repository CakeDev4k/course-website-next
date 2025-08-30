import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/clent.ts"
import { courses } from "../database/schema.ts"
import z from "zod"
import { checkUserRole } from "./hooks/check-user-role.ts"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"

export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses/', {
        preHandler: [
            checkRequestJWT,
            checkUserRole('manager'),
        ],
        schema: {
            tags: ['courses'],
            summary: 'Create a courses',
            body: z.object({
                title: z.string().min(5, "Titulo precisa ter 5 ccaracteres"),
                description: z.string().nonoptional(),
            }),
            response: {
                201: z.object({
                    courseId: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
    const { title, description } = request.body

    const result = await db
        .insert(courses)
        .values({ title, description })
        .returning()

    return reply.status(201).send({ courseId: result[0].id })
})
}