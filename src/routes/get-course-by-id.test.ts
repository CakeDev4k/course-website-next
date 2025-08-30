import { test, expect } from "vitest"
import { server } from "../app.ts"
import request from "supertest"
import { makeCourse } from "../tests/factories/make-course.ts"
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts"


test("Get course by id", async () => {
    await server.ready()

    const {token} = await makeAuthenticatedUser('student')

    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
        }
    })
})

test("Return 404 for non existing courses", async () => {
    await server.ready()

    const {token} = await makeAuthenticatedUser('student')

    const response = await request(server.server)
        .get(`/courses/ae1836f8-ee0e-4a91-912c-e204766cc4ae`)
        .set('Authorization', token)

    expect(response.statusCode).toEqual(404)
})