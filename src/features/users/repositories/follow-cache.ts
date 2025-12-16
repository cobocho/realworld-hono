import { injectable } from 'tsyringe';

import { RedisClient } from '@shared/cache/redis-client';

@injectable()
export class FollowCache {
  constructor(private readonly redisClient: RedisClient) {}

  async getFollowers(userId: string): Promise<string[]> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    return await redis.sMembers(key);
  }

  async addFollower(userId: string, followerId: string): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    await redis.sAdd(key, followerId);
  }

  async removeFollower(userId: string, followerId: string): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    await redis.sRem(key, followerId);
  }

  async isFollower(userId: string, followerId: string): Promise<boolean> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    return (await redis.sIsMember(key, followerId)) === 1;
  }

  async deleteFollowersCache(userId: string): Promise<void> {
    const redis = await this.redisClient.getClient();
    const key = `user:${userId}:followers`;

    await redis.del(key);
  }
}
