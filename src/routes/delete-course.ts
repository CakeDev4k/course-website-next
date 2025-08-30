import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/clent.ts"
import { courses } from "../database/schema.ts"
import z from "zod"
import { eq } from "drizzle-orm"

export const deleteCourseByIdRoute: FastifyPluginAsyncZod = async(server) => {
    server.delete('/courses/:id', {
        schema: {
            tags: ['courses'],
            summary: 'Delete a course by id',
            params: z.object({
                id: z.uuid(),
            }),
            response: {
                200: z.object({
                    message: z.string()
                }),

                404: z.null().describe("Course not found"),
            },
        },
    } , async (request,reply) => {
        const courseParamsId = request.params.id

        const result = await db.delete(courses).where(eq(courses.id,courseParamsId))

        if(result > 0){
            return reply.status(200).send({ message: "Tudo certo slkkkk" })
        }

        return reply.status(404).send()
    })
}