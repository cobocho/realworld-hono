import { injectable } from 'tsyringe';

import RedisClient from './redis-client';

@injectable()
export class RedisService {
  private async getClient() {
    return RedisClient.getClient();
  }

  async get(key: string): Promise<string | null> {
    const client = await this.getClient();
    return client.get(key);
  }

  async set(key: string, value: string, expiresIn: number): Promise<void> {
    const client = await this.getClient();
    await client.set(key, value);
    if (expiresIn) {
      await client.expire(key, Math.floor(expiresIn / 1000));
    }
  }

  async del(key: string): Promise<void> {
    const client = await this.getClient();
    await client.del(key);
  }

  async lPush(key: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.lPush(key, value);
  }

  async lPop(key: string): Promise<string | null> {
    const client = await this.getClient();
    return client.lPop(key);
  }

  async lRem(key: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.lRem(key, 1, value);
  }

  async lLen(key: string): Promise<number> {
    const client = await this.getClient();
    return client.lLen(key);
  }

  async lIndex(key: string, index: number): Promise<string | null> {
    const client = await this.getClient();
    return client.lIndex(key, index);
  }

  async lSet(key: string, index: number, value: string): Promise<void> {
    const client = await this.getClient();
    await client.lSet(key, index, value);
  }

  async zAdd(key: string, score: number, value: string): Promise<void> {
    const client = await this.getClient();
    await client.zAdd(key, { score, value });
  }

  async zScore(key: string, value: string): Promise<number | null> {
    const client = await this.getClient();
    return client.zScore(key, value);
  }

  async zCard(key: string): Promise<number> {
    const client = await this.getClient();
    return client.zCard(key);
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    const client = await this.getClient();
    return client.zRange(key, start, stop);
  }

  async zRem(key: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.zRem(key, value);
  }

  async zRemRangeByRank(
    key: string,
    start: number,
    stop: number
  ): Promise<void> {
    const client = await this.getClient();
    await client.zRemRangeByRank(key, start, stop);
  }

  async expire(key: string, seconds: number): Promise<void> {
    const client = await this.getClient();
    await client.expire(key, seconds);
  }
  async sAdd(key: string, value: string, expiresIn: number): Promise<void> {
    const client = await this.getClient();
    await client.sAdd(key, value);

    if (expiresIn) {
      await client.expire(key, Math.floor(expiresIn / 1000));
    }
  }

  async sRem(key: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.sRem(key, value);
  }

  async sIsMember(key: string, value: string): Promise<boolean> {
    const client = await this.getClient();
    const result = await client.sIsMember(key, value);
    return result === 1;
  }

  async sCard(key: string): Promise<number> {
    const client = await this.getClient();
    return client.sCard(key);
  }

  async sMembers(key: string): Promise<string[]> {
    const client = await this.getClient();
    return client.sMembers(key);
  }

  async sPop(key: string): Promise<string | null> {
    const client = await this.getClient();
    return client.sPop(key);
  }
}
