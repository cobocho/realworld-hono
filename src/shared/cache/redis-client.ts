// redis-client.ts
import { createClient } from 'redis';
import { singleton } from 'tsyringe';

export type RedisInstance = ReturnType<typeof createClient>;

@singleton()
export class RedisClient {
  private client: RedisInstance | null = null;
  private isConnecting = false;
  private connectionPromise: Promise<RedisInstance> | null = null;

  async getClient(): Promise<RedisInstance> {
    if (this.client) {
      return this.client;
    }

    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = this.connect();

    return this.connectionPromise;
  }

  private async connect(): Promise<RedisInstance> {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connecting...');
    });

    this.client.on('ready', () => {
      console.log('✅ Redis ready');
    });

    this.client.on('error', err => {
      console.error('❌ Redis error:', err);
    });

    this.client.on('end', () => {
      console.log('⚠️ Redis connection closed');
      this.client = null;
      this.isConnecting = false;
    });

    await this.client.connect();
    this.isConnecting = false;

    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

export default RedisClient;
