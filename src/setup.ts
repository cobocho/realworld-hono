import 'reflect-metadata';
import { container } from 'tsyringe';

import { RedisClient } from '@shared/cache/redis-client';

export async function setupInfrastructure() {
  try {
    const redisClient = container.resolve(RedisClient);
    await redisClient.getClient();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Failed to setup infrastructure:', error);
    throw error;
  }
}
