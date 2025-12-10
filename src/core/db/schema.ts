import { pgTable, timestamp, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  user_id: uuid('user_id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hash_password: varchar('hash_password', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  bio: text('bio').default(''),
  image: varchar('image', { length: 500 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
