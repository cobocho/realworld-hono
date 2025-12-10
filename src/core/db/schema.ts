import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	user_id: uuid('user_id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
