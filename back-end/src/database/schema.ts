import { pgTable, uuid, text, timestamp, uniqueIndex, pgEnum, integer, boolean } from "drizzle-orm/pg-core";

export const userRole = pgEnum('user_role', [
    'student',
    'manager'
])

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    role: userRole().notNull().default('student')
})

export const categories = pgTable("categories", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull().unique(),
    description: text(),
    color: text(), // Cor da categoria (hex)
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
})

export const tags = pgTable("tags", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull().unique(),
    color: text(), // Cor da tag (hex)
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
})

export const courses = pgTable("courses", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text(),
    imageUrl: text(), // URL da imagem do curso
    imageKey: text(), // Chave para deletar da cloud storage
    categoryId: uuid().references(() => categories.id), // Categoria do curso
})

export const courseTags = pgTable("course_tags", {
    id: uuid().primaryKey().defaultRandom(),
    courseId: uuid().notNull().references(() => courses.id),
    tagId: uuid().notNull().references(() => tags.id),
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
}, table => [
    uniqueIndex().on(table.courseId, table.tagId)
])

export const lessons = pgTable("lessons", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    youtubeUrl: text().notNull(), // URL do YouTube
    order: integer().notNull(), // Ordem da aula no curso
    courseId: uuid().notNull().references(() => courses.id),
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
})

export const enrollments = pgTable("enrollments",{
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    courseId: uuid().notNull().references(() => courses.id),
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
}, table => [
    uniqueIndex().on(table.userId,table.courseId)
])

export const lessonProgress = pgTable("lesson_progress", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    lessonId: uuid().notNull().references(() => lessons.id),
    watched: boolean().notNull().default(false),
    watchedAt: timestamp({ withTimezone: true}),
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
}, table => [
    uniqueIndex().on(table.userId, table.lessonId)
])

export const favorites = pgTable("favorites", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    courseId: uuid().notNull().references(() => courses.id),
    createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
}, table => [
    uniqueIndex().on(table.userId, table.courseId)
])