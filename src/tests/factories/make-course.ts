import { faker } from "@faker-js/faker";
import { db } from "../../database/clent.ts";
import { courses } from "../../database/schema.ts";


export async function makeCourse(title?: string, description?: string) {
    const result = await db.insert(courses).values({
        title: title ?? faker.lorem.words(4),
        description: description ?? faker.lorem.words(10)
    }).returning()

    return result[0]
}