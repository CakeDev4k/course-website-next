import { test, expect } from "vitest"
import { server } from "../app.ts"
import { randomUUID } from "node:crypto"
import request from "supertest"
import { makeCourse } from "../tests/factories/make-course.ts"
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts"


test("Get course by id", async () => {
    await server.ready()

    const {token} = await makeAuthenticatedUser('manager')

    const titleId = randomUUID()
    const descriptionId = randomUUID()

    const course = await makeCourse(titleId,descriptionId)

    const response = await request(server.server)
        .get(`/courses?search=${titleId}`)
        .set('Authorization', token)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: titleId,
                enrollments: 0,
            }
        ]
    })
})