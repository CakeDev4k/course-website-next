import fastify from "fastify"
import {fastifySwagger} from "@fastify/swagger"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import scalarAPIReference from "@scalar/fastify-api-reference"
import { getCourses } from "./routes/get-courses.ts"
import { getCoursesByIdRoute } from "./routes/get-course-by-id.ts"
import { createCoursesRoute } from "./routes/create-course.ts"
import { deleteCourseByIdRoute } from "./routes/delete-course.ts"
import { updateCourseByIdRoute } from "./routes/update-course.ts"
import { loginRoute } from "./routes/login.ts"
import { registerRoute } from "./routes/register.ts"

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if(process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Rocketseat API',
        version: '1.0.0',
      }},
      transform: jsonSchemaTransform,
    })

    server.register(scalarAPIReference, {
      routePrefix: '/docs'
    })
  }

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(getCourses)
server.register(getCoursesByIdRoute)
server.register(createCoursesRoute)
server.register(deleteCourseByIdRoute)
server.register(updateCourseByIdRoute)
server.register(loginRoute)
server.register(registerRoute)

export {server}