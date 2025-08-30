import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/clent.ts"
import { courses } from "../database/schema.ts"
import z from "zod"
import { eq } from "drizzle-orm"

export const updateCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.put('/courses/:id', {
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

                404: z.null().describe("Course not found"),
            },
        },
    }, async (request, reply) => {
        const { id, title, description } = request.body

        const result = await db
            .update(courses)
            .set({ title, description })
            .where(eq(courses.id, id))
            .returning()

        if (result) {
            return reply.status(201).send({ courseId: result[0].id })
        }

        return reply.status(404).send()
    })
}