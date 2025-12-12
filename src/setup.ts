import 'reflect-metadata';
import { runRedis } from '@shared/cache/redis-client';

export async function setupInfrastructure() {
  try {
    await runRedis();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Failed to setup infrastructure:', error);
    throw error;
  }
}
