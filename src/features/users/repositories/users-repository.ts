// users.repository.ts
import { eq } from 'drizzle-orm';
import { omit } from 'es-toolkit';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@core/db/base-repository';
import { users, type User } from '@core/db/schema';

import { db } from '@integrations/database';

import type { EditUserDto } from '../model/edit-user-dto';

import { UserCache } from './user-cache';

@injectable()
export class UsersRepository extends BaseRepository {
  constructor(private readonly userCache: UserCache) {
    super();
  }

  async createUser(userData: {
    user: { username: string; email: string; password: string };
  }) {
    const createdUser = await this.insertOne(() =>
      db
        .insert(users)
        .values({
          username: userData.user.username,
          email: userData.user.email,
          hash_password: userData.user.password,
        })
        .returning()
    );

    await this.userCache.saveUserProfile(
      createdUser.user_id,
      omit(createdUser, ['hash_password'])
    );

    return createdUser;
  }

  async findByEmail(
    email: string,
    includeHashPassword: boolean = false
  ): Promise<Omit<User, 'hash_password'> & { hash_password?: string }> {
    if (!includeHashPassword) {
      const cachedUser = await this.userCache.getUserProfile(email);
      if (cachedUser) {
        return cachedUser;
      }
    }

    return this.executeQuery(async () => {
      const [user] = await db
        .select({
          user_id: users.user_id,
          email: users.email,
          username: users.username,
          bio: users.bio,
          image: users.image,
          ...(includeHashPassword
            ? { hash_password: users.hash_password }
            : {}),
          created_at: users.created_at,
          updated_at: users.updated_at,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user) {
        await this.userCache.saveUserProfile(
          user.user_id,
          omit(user, ['hash_password'])
        );
      }

      return user;
    });
  }

  async findByUserId(userId: string, includeHashPassword: boolean = false) {
    if (!includeHashPassword) {
      const cachedUser = await this.userCache.getUserProfile(userId);

      if (cachedUser) {
        return cachedUser;
      }
    }

    return this.executeQuery(async () => {
      const [user] = await db
        .select({
          user_id: users.user_id,
          email: users.email,
          username: users.username,
          bio: users.bio,
          image: users.image,
          ...(includeHashPassword
            ? { hash_password: users.hash_password }
            : {}),
          created_at: users.created_at,
          updated_at: users.updated_at,
        })
        .from(users)
        .where(eq(users.user_id, userId))
        .limit(1);

      if (user) {
        await this.userCache.saveUserProfile(
          user.user_id,
          omit(user, ['hash_password'])
        );
      }

      return null;
    });
  }

  async updateUser(userId: string, userData: EditUserDto) {
    const updatedUser = await this.executeQuery(async () => {
      const [user] = await db
        .update(users)
        .set({
          email: userData.user.email,
          bio: userData.user.bio,
          image: userData.user.image,
        })
        .where(eq(users.user_id, userId))
        .returning();

      return user;
    });

    await this.userCache.saveUserProfile(
      userId,
      omit(updatedUser, ['hash_password'])
    );

    return updatedUser;
  }
}
