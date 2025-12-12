import { createClient } from 'redis';

export type RedisInstance = ReturnType<typeof createClient>;

class RedisClient {
  private static instance: RedisInstance | null = null;
  private static isConnecting = false;
  private static connectionPromise: Promise<void> | null = null;

  static async getClient() {
    if (this.instance) {
      return this.instance;
    }

    if (this.isConnecting && this.connectionPromise) {
      await this.connectionPromise;
      return this.instance!;
    }

    this.isConnecting = true;
    this.connectionPromise = this.connect();
    await this.connectionPromise;

    return this.instance!;
  }

  private static async connect() {
    this.instance = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.instance.on('connect', () => {
      console.log('✅ Redis connecting...');
    });

    this.instance.on('ready', () => {
      console.log('✅ Redis ready');
    });

    this.instance.on('error', err => {
      console.error('❌ Redis error:', err);
    });

    this.instance.on('end', () => {
      console.log('⚠️ Redis connection closed');
      this.instance = null;
      this.isConnecting = false;
    });

    await this.instance.connect();
    this.isConnecting = false;
  }
}

export const runRedis = async () => {
  await RedisClient.getClient();
};

export default RedisClient;
