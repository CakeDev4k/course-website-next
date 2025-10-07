import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/clent.ts"
import { courses, lessons, lessonProgress, enrollments, favorites } from "../../database/schema.ts"
import z from "zod"
import { eq } from "drizzle-orm"

export const deleteCourseByIdRoute: FastifyPluginAsyncZod = async(server) => {
    server.delete('/courses/:id', {
        schema: {
            tags: ['courses'],
            summary: 'Delete a course by id',
            params: z.object({
                id: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    message: z.string()
                }),
                404: z.object({
                    error: z.string()
                }),
                500: z.object({
                    error: z.string()
                }),
            },
        },
    }, async (request, reply) => {
        const courseParamsId = request.params.id
        try {
            // Verificar se o curso existe
            const courseExists = await db
                .select({ id: courses.id })
                .from(courses)
                .where(eq(courses.id, courseParamsId))
                .limit(1)
            
            if (courseExists.length === 0) {
                return reply.status(404).send({
                    error: 'Curso não encontrado'
                })
            }
            
            // Buscar todas as lessons deste curso
            const courseLessons = await db
                .select({ id: lessons.id })
                .from(lessons)
                .where(eq(lessons.courseId, courseParamsId))
            
            const lessonIds = courseLessons.map(lesson => lesson.id)
            
            // Deletar em ordem (respeitando foreign keys):
            
            // 1. Deletar progresso das aulas (se houver)
            if (lessonIds.length > 0) {
                for (const lessonId of lessonIds) {
                    await db
                        .delete(lessonProgress)
                        .where(eq(lessonProgress.lessonId, lessonId))
                }
            }
            
            // 2. Deletar matrículas/enrollments do curso
            await db
                .delete(enrollments)
                .where(eq(enrollments.courseId, courseParamsId))
            
            // 3. Deletar favoritos do curso (NOVO - CRÍTICO)
            await db
                .delete(favorites)
                .where(eq(favorites.courseId, courseParamsId))
            
            // 4. Deletar as aulas do curso
            await db
                .delete(lessons)
                .where(eq(lessons.courseId, courseParamsId))
            
            // 5. Finalmente, deletar o curso
            await db
                .delete(courses)
                .where(eq(courses.id, courseParamsId))
            
            return reply.status(200).send({
                message: "Curso deletado com sucesso"
            })
        } catch (error) {
            console.error('Erro ao deletar curso:', error)
            return reply.status(500).send({
                error: 'Erro ao deletar o curso. Verifique as dependências.'
            })
        }
    })
}