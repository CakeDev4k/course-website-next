import fastify from "fastify"
import { fastifySwagger } from "@fastify/swagger"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import scalarAPIReference from "@scalar/fastify-api-reference"
import cors from '@fastify/cors'
import multipart from "@fastify/multipart"
import fastifyCookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import path from 'path'

// Grouped route indexes
import * as coursesRoutes from "./routes/courses/index.ts"
import * as lessonsRoutes from "./routes/lessons/index.ts"
import * as favoritesRoutes from "./routes/favorites/index.ts"
import * as tagsRoutes from "./routes/tags/index.ts"
import * as authRoutes from "./routes/auth/index.ts"
import * as categoryRoutes from "./routes/categories/index.ts"

// Individual routes not part of an index
import { enrollCourseRoute } from "./routes/enroll-course.ts"
import { checkEnrollmentRoute } from "./routes/check-enrollment.ts"


const server = fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>()

// Middleware para logging de requisições
server.addHook('onRequest', async (request, reply) => {
    console.log(`→ ${request.method} ${request.url}`)
})

// Register multipart for file uploads
server.register(multipart, {
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
})

server.register(fastifyCookie, {
    secret: 'a-secret-string-for-signing-cookies',
})

server.register(cors, {
    origin: 'http://localhost:3000', // Allow your frontend’s origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // If your app uses cookies or auth headers
})

// Servir arquivos estáticos da pasta uploads em /uploads
server.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/', // Ex.: /uploads/courses/..
    decorateReply: false, // não polui a interface de reply
})

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'API de Cursos',
            description: 'API para gerenciamento de cursos e aulas',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3333',
                description: 'Servidor de desenvolvimento',
            },
        ],
    },
    transform: jsonSchemaTransform,
})

server.register(scalarAPIReference, {
    routePrefix: '/reference',
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Auth
server.register(authRoutes.loginRoute)
server.register(authRoutes.registerRoute)

// Courses (including upload & course-tags)
server.register(coursesRoutes.getCourses)
server.register(coursesRoutes.getCoursesByIdRoute)
server.register(coursesRoutes.createCoursesRoute)
server.register(coursesRoutes.deleteCourseByIdRoute)
server.register(coursesRoutes.updateCourseByIdRoute)
server.register(coursesRoutes.uploadCourseImageRoute)
server.register(coursesRoutes.courseTagsRoute)

// Lessons
server.register(lessonsRoutes.createLessonRoute)
server.register(lessonsRoutes.getLessonsRoute)
server.register(lessonsRoutes.markLessonWatchedRoute)
server.register(lessonsRoutes.deleteLessonRoute)
server.register(lessonsRoutes.updateLessonRoute)

// Favorites
server.register(favoritesRoutes.addFavoriteRoute)
server.register(favoritesRoutes.removeFavoriteRoute)
server.register(favoritesRoutes.getFavoritesRoute)
server.register(favoritesRoutes.checkFavoriteRoute)

// Enrollments
server.register(enrollCourseRoute)
server.register(checkEnrollmentRoute)

// Categories
server.register(categoryRoutes.getCategoriesRoute)
server.register(categoryRoutes.createCategoryRoute)
server.register(categoryRoutes.updateCategoryRoute)
server.register(categoryRoutes.deleteCategoryRoute)

// Tags
server.register(tagsRoutes.tagsGetRoute)
server.register(tagsRoutes.tagsPostRoute)
server.register(tagsRoutes.tagsPutRoute)
server.register(tagsRoutes.tagsDeleteRoute)

export { server }