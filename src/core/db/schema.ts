import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  user_id: uuid('user_id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hash_password: varchar('hash_password', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  bio: text('bio').default(''),
  image: varchar('image', { length: 500 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;

export const followings = pgTable(
  'followings',
  {
    user_id: uuid('user_id'),
    follower_id: uuid('follower_id'),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  table => [
    primaryKey({ columns: [table.user_id, table.follower_id] }),
    uniqueIndex('unique_following_followed').on(
      table.user_id,
      table.follower_id
    ),
  ]
);

export type Following = typeof followings.$inferSelect;
