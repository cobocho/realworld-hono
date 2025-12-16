import { injectable } from 'tsyringe';

import type { User } from '@core/db/schema';

import { RedisClient } from '@shared/cache/redis-client';

@injectable()
export class UserCache {
  constructor(private readonly redisClient: RedisClient) {}

  async getUserProfile(
    userId: string
  ): Promise<Omit<User, 'hash_password'> | null> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:profile`;

    const user = await redis.get(key);
    return user ? JSON.parse(user) : null;
  }

  async saveUserProfile(
    userId: string,
    user: Omit<User, 'hash_password'>
  ): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:profile`;

    await redis.set(key, JSON.stringify(user), {
      EX: 60 * 60 * 24 * 7,
    });
  }

  async deleteUserProfile(userId: string): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:profile`;

    await redis.del(key);
  }

  async getUserFollowers(userId: string): Promise<string[]> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    return await redis.sMembers(key);
  }

  async addUserToFollowers(userId: string, followerId: string): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    await redis.sAdd(key, followerId);
  }

  async removeUserFromFollowers(
    userId: string,
    followerId: string
  ): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    await redis.sRem(key, followerId);
  }
}
