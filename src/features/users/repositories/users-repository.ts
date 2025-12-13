import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@core/db/base-repository';
import { users } from '@core/db/schema';

import { db } from '@integrations/database';

import type { EditUserDto } from '../model/edit-user-dto';
import type { UserRegisterDto } from '../model/user-register.dto';

@injectable()
export class UsersRepository extends BaseRepository {
  async createUser(userData: UserRegisterDto) {
    return this.insertOne(() =>
      db
        .insert(users)
        .values({
          username: userData.user.username,
          email: userData.user.email,
          hash_password: userData.user.password,
        })
        .returning()
    );
  }

  async findByEmail(email: string) {
    return this.executeQuery(async () => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return user;
    });
  }

  async findByUserId(userId: string) {
    return this.executeQuery(async () => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.user_id, userId))
        .limit(1);

      console.log(userId, user);

      return user;
    });
  }

  async updateUser(userId: string, userData: EditUserDto) {
    return this.executeQuery(async () => {
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
  }
}
