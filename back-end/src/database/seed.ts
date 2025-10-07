import { db } from "./clent.ts"
import { categories, courses, enrollments, users } from "./schema.ts"
import {fakerPT_BR as faker} from "@faker-js/faker"
import { hash } from 'argon2'


async function seed() {
    const passwordHash = await hash('123123')

    // Inserir categorias
    const categoriesInsert = await db.insert(categories).values([
        { name: 'Frontend', description: 'Desenvolvimento de interfaces', color: '#2563eb' },
        { name: 'Backend', description: 'Desenvolvimento de servidores e APIs', color: '#16a34a' },
        { name: 'Mobile', description: 'Desenvolvimento de aplicativos móveis', color: '#db2777' },
        { name: 'DevOps', description: 'Infraestrutura e CI/CD', color: '#9333ea' },
        { name: 'Data Science', description: 'Análise de dados e machine learning', color: '#ea580c' },
        { name: 'UX/UI', description: 'Design de interfaces e experiência do usuário', color: '#4f46e5' },
    ]).returning()

    const usersInsert = await db.insert(users).values([
        {name: faker.person.fullName(), email: faker.internet.email(), password: passwordHash, role: 'student'},
        {name: faker.person.fullName(), email: faker.internet.email(), password: passwordHash, role: 'student'},
        {name: faker.person.fullName(), email: faker.internet.email(), password: passwordHash, role: 'student'},
        {name: faker.person.fullName(), email: faker.internet.email(), password: passwordHash, role: 'student'},
        {name: faker.person.fullName(), email: faker.internet.email(), password: passwordHash, role: 'student'},
    ]).returning()

    // Associar cursos a categorias aleatórias
    const coursesInsert = await db.insert(courses).values([
        {
            title: faker.lorem.words(4), 
            description: faker.lorem.paragraph(),
            categoryId: categoriesInsert[Math.floor(Math.random() * categoriesInsert.length)].id
        },
        {
            title: faker.lorem.words(4),
            description: faker.lorem.paragraph(),
            categoryId: categoriesInsert[Math.floor(Math.random() * categoriesInsert.length)].id
        },
    ]).returning()

    await db.insert(enrollments).values([
        {userId: usersInsert[0].id, courseId: coursesInsert[0].id},
        {userId: usersInsert[1].id, courseId: coursesInsert[0].id},
        {userId: usersInsert[2].id, courseId: coursesInsert[1].id},
    ])
}

seed()