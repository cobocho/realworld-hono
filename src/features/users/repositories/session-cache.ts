// session.cache.ts
import { injectable } from 'tsyringe';

import { RedisClient, type RedisInstance } from '@shared/cache/redis-client';

@injectable()
export class SessionCache {
  private readonly MAX_SESSIONS = 5;

  constructor(private readonly redisClient: RedisClient) {}

  private redis: RedisInstance | null = null;

  private async getRedis(): Promise<RedisInstance> {
    if (!this.redis) {
      this.redis = await this.redisClient.getClient();
    }
    return this.redis;
  }

  async saveSession(
    userId: string,
    sessionID: string,
    expiresIn: number
  ): Promise<void> {
    const redis = await this.getRedis();
    const key = `user:${userId}:sessions`;
    const timestamp = Date.now();

    await redis.zAdd(key, { score: timestamp, value: sessionID });
    await redis.zRemRangeByRank(key, 0, -(this.MAX_SESSIONS + 1));
    await redis.expire(key, Math.floor(expiresIn / 1000));
  }

  async getSessions(userId: string): Promise<string[]> {
    const redis = await this.getRedis();
    const key = `user:${userId}:sessions`;

    return await redis.zRange(key, 0, this.MAX_SESSIONS - 1);
  }

  async removeSession(userId: string, sessionID: string): Promise<void> {
    const redis = await this.getRedis();
    const key = `user:${userId}:sessions`;
    await redis.zRem(key, sessionID);
  }

  async hasSession(userId: string, sessionID: string): Promise<boolean> {
    const redis = await this.getRedis();
    const key = `user:${userId}:sessions`;
    const score = await redis.zScore(key, sessionID);

    return score !== null;
  }

  async clearSessions(userId: string): Promise<void> {
    const redis = await this.getRedis();
    const key = `user:${userId}:sessions`;

    await redis.del(key);
  }

  async getSessionCount(userId: string): Promise<number> {
    const redis = await this.getRedis();
    const key = `user:${userId}:sessions`;

    return await redis.zCard(key);
  }
}
