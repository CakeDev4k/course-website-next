import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../database/clent.ts"
import { courseTags, courses, tags } from "../../database/schema.ts"
import { eq, and, inArray } from "drizzle-orm"
import { checkRequestJWT } from "../hooks/check-request-jwt.ts"
import { checkUserRole } from "../hooks/check-user-role.ts"

export const courseTagsRoute: FastifyPluginAsyncZod = async (server) => {
  // Adicionar tags ao curso
  server.post('/courses/:courseId/tags', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['course-tags'],
      summary: 'Add tags to course',
      params: z.object({
        courseId: z.string(),
      }),
      body: z.object({
        tagIds: z.array(z.string()).min(1, 'Pelo menos uma tag é obrigatória'),
      }),
      response: {
        200: z.object({
          message: z.string(),
          addedTags: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              color: z.string().nullable(),
            })
          ),
        }),
        400: z.object({
          error: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { courseId } = request.params
    const { tagIds } = request.body

    try {
      // Verificar se o curso existe
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

      if (course.length === 0) {
        return reply.status(404).send({
          error: 'Curso não encontrado'
        })
      }

      // Verificar se as tags existem
      const existingTags = await db
        .select()
        .from(tags)
        .where(inArray(tags.id, tagIds))

      if (existingTags.length !== tagIds.length) {
        return reply.status(400).send({
          error: 'Uma ou mais tags não existem'
        })
      }

      // Verificar quais tags já estão no curso
      const existingCourseTags = await db
        .select({ tagId: courseTags.tagId })
        .from(courseTags)
        .where(eq(courseTags.courseId, courseId))

      const existingTagIds = existingCourseTags.map(ct => ct.tagId)
      const newTagIds = tagIds.filter(tagId => !existingTagIds.includes(tagId))

      if (newTagIds.length === 0) {
        return reply.status(400).send({
          error: 'Todas as tags já estão no curso'
        })
      }

      // Adicionar novas tags
      const newCourseTags = newTagIds.map(tagId => ({
        courseId,
        tagId,
      }))

      await db
        .insert(courseTags)
        .values(newCourseTags)

      // Buscar informações das tags adicionadas
      const addedTags = existingTags.filter(tag => newTagIds.includes(tag.id))

      return reply.status(200).send({
        message: `${addedTags.length} tag(s) adicionada(s) ao curso`,
        addedTags: addedTags.map(tag => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })),
      })

    } catch (error) {
      console.error('Erro ao adicionar tags ao curso:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })

  // Remover tags do curso
  server.delete('/courses/:courseId/tags', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['course-tags'],
      summary: 'Remove tags from course',
      params: z.object({
        courseId: z.string().uuid(),
      }),
      body: z.object({
        tagIds: z.array(z.string().uuid()).min(1, 'Pelo menos uma tag é obrigatória'),
      }),
      response: {
        200: z.object({
          message: z.string(),
          removedTags: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              color: z.string().nullable(),
            })
          ),
        }),
        400: z.object({
          error: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { courseId } = request.params
    const { tagIds } = request.body

    try {
      // Verificar se o curso existe
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

      if (course.length === 0) {
        return reply.status(404).send({
          error: 'Curso não encontrado'
        })
      }

      // Verificar quais tags estão no curso
      const existingCourseTags = await db
        .select({ tagId: courseTags.tagId })
        .from(courseTags)
        .where(eq(courseTags.courseId, courseId))

      const existingTagIds = existingCourseTags.map(ct => ct.tagId)
      const tagsToRemove = tagIds.filter(tagId => existingTagIds.includes(tagId))

      if (tagsToRemove.length === 0) {
        return reply.status(400).send({
          error: 'Nenhuma das tags está no curso'
        })
      }

      // Remover tags
      await db
        .delete(courseTags)
        .where(and(
          eq(courseTags.courseId, courseId),
          inArray(courseTags.tagId, tagsToRemove)
        ))

      // Buscar informações das tags removidas
      const removedTags = await db
        .select()
        .from(tags)
        .where(inArray(tags.id, tagsToRemove))

      return reply.status(200).send({
        message: `${removedTags.length} tag(s) removida(s) do curso`,
        removedTags: removedTags.map(tag => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })),
      })

    } catch (error) {
      console.error('Erro ao remover tags do curso:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })

  // Listar tags do curso
  server.get('/courses/:courseId/tags', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['course-tags'],
      summary: 'Get course tags',
      params: z.object({
        courseId: z.string(),
      }),
      response: {
        200: z.object({
          tags: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              color: z.string().nullable(),
            })
          ),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { courseId } = request.params

    try {
      // Verificar se o curso existe
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

      if (course.length === 0) {
        return reply.status(404).send({
          error: 'Curso não encontrado'
        })
      }

      // Buscar tags do curso
      const courseTagsList = await db
        .select({
          id: tags.id,
          name: tags.name,
          color: tags.color,
        })
        .from(courseTags)
        .innerJoin(tags, eq(tags.id, courseTags.tagId))
        .where(eq(courseTags.courseId, courseId))

      return reply.status(200).send({
        tags: courseTagsList,
      })

    } catch (error) {
      console.error('Erro ao buscar tags do curso:', error)
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  })
}
