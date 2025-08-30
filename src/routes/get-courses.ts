import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/clent.ts"
import { courses, enrollments } from "../database/schema.ts"
import { ilike, and, eq, SQL, count} from "drizzle-orm"
import { z } from "zod"
import { sortBy } from "../utils/sortBy.ts"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { checkUserRole } from "./hooks/check-user-role.ts"

export const getCourses: FastifyPluginAsyncZod = async(server) => {
    server.get('/courses', {
        preHandler: [
            checkRequestJWT,
            checkUserRole('manager'),
        ],
        schema: {
            tags: ['courses'],
            summary: 'Get all courses',
            querystring: z.object({
                search: z.string().optional(),
                orderBy: z.enum(['title','id']).optional().default("title"),
                sortType: z.enum(["asc","desc"]).optional().default("asc"),
                page: z.coerce.number().optional().default(1),
            }),
            response: {
                200: z.object({
                    courses: z.array(
                        z.object({
                            id: z.uuid(),
                            title: z.string(),
                            enrollments: z.number()
                        })
                    ),
                    total: z.number(),
                }),
            },
        },
    } , async (request,reply) => {
        const {search,orderBy,sortType, page} = request.query

        const conditions: SQL[] = []

        if(search){
            conditions.push(ilike(courses.title,`%${search}%`))
        }

        const [result,total] = await Promise.all([
            db.select({
                id: courses.id,
                title: courses.title,
                enrollments: count(enrollments.id)
            }).from(courses)
            .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
            .orderBy(sortBy(courses[orderBy],sortType))
            .offset((page - 1) * 2)
            .limit(2)
            .where(and(...conditions))
            .groupBy(courses.id),
            db.$count(courses, and(...conditions))
        ])

        return reply.status(200).send({ courses: result, total })
    })
}