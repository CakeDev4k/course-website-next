import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/clent.ts"
import { courses, enrollments, favorites, categories, courseTags, tags } from "../../database/schema.ts"
import { ilike, and, eq, SQL, count, inArray} from "drizzle-orm"
import { z } from "zod"
import { sortBy } from "../../utils/sortBy.ts"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export const getCourses: FastifyPluginAsyncZod = async(server) => {
    server.get('/courses', {
        preHandler: [
            checkRequestJWT,
        ],
        schema: {
            tags: ['courses'],
            summary: 'Get all courses',
            querystring: z.object({
                search: z.string().optional(),
                categoryId: z.uuid().optional(),
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
                            description: z.string().nullable(),
                            imageUrl: z.string().nullable(),
                            enrollments: z.number(),
                            isFavorite: z.boolean(),
                            category: z.object({
                                id: z.string(),
                                name: z.string(),
                                color: z.string().nullable(),
                            }).nullable(),
                            tags: z.array(
                                z.object({
                                    id: z.string(),
                                    name: z.string(),
                                    color: z.string().nullable(),
                                })
                            ),
                        })
                    ),
                    total: z.number(),
                }),
            },
        },
    } , async (request,reply) => {
        const {search, categoryId, orderBy, sortType, page} = request.query
        const user = getAuthenticatedUserFromRequest(request)

        const conditions: SQL[] = []

        if(search){
            conditions.push(ilike(courses.title,`%${search}%`))
        }

        if(categoryId){
            conditions.push(eq(courses.categoryId, categoryId))
        }

        const [result,total] = await Promise.all([
            db.select({
                id: courses.id,
                title: courses.title,
                description: courses.description,
                imageUrl: courses.imageUrl,
                enrollments: count(enrollments.id)
            }).from(courses)
            .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
            .orderBy(sortBy(courses[orderBy],sortType))
            .offset((page - 1) * 2)
            .limit(4)
            .where(and(...conditions))
            .groupBy(courses.id),
            db.$count(courses, and(...conditions))
        ])

        // Buscar favoritos do usuário
        const userFavorites = await db
            .select({ courseId: favorites.courseId })
            .from(favorites)
            .where(eq(favorites.userId, user.sub))

        const favoriteCourseIds = new Set(userFavorites.map(f => f.courseId))

        // Buscar categorias dos cursos
        const courseIds = result.map(c => c.id)
        const courseCategories = await db
            .select({
                courseId: courses.id,
                category: {
                    id: categories.id,
                    name: categories.name,
                    color: categories.color,
                }
            })
            .from(courses)
            .leftJoin(categories, eq(categories.id, courses.categoryId))
            .where(inArray(courses.id, courseIds))

        // Buscar tags dos cursos
        const courseTagsList = await db
            .select({
                courseId: courseTags.courseId,
                tag: {
                    id: tags.id,
                    name: tags.name,
                    color: tags.color,
                }
            })
            .from(courseTags)
            .innerJoin(tags, eq(tags.id, courseTags.tagId))
            .where(inArray(courseTags.courseId, courseIds))

        // Organizar tags por curso
        const tagsByCourse = new Map()
        courseTagsList.forEach(ct => {
            if (!tagsByCourse.has(ct.courseId)) {
                tagsByCourse.set(ct.courseId, [])
            }
            tagsByCourse.get(ct.courseId).push(ct.tag)
        })

        // Organizar categorias por curso
        const categoriesByCourse = new Map()
        courseCategories.forEach(cc => {
            categoriesByCourse.set(cc.courseId, cc.category)
        })

        // Enriquecer cursos com informações de favorito, categoria e tags
        const enrichedCourses = result.map(course => ({
            ...course,
            isFavorite: favoriteCourseIds.has(course.id),
            category: categoriesByCourse.get(course.id) || null,
            tags: tagsByCourse.get(course.id) || [],
        }))

        return reply.status(200).send({ courses: enrichedCourses, total })
    })
}