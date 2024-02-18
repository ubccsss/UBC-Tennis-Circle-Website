import Redis from 'ioredis';

export const redis = new Redis(`${process.env.REDIS_URL}`);

export class Cache {
  static async fetch<T>(key: string, fetcher: () => T, expires: number) {
    const existing = await this.get<T>(key);

    if (existing !== null) return existing;

    return this.set(key, fetcher, expires);
  }

  static async set<T>(key: string, fetcher: () => T, expires: number) {
    const value = await fetcher();
    await redis.set(key, JSON.stringify(value), 'EX', expires);

    return value;
  }

  static async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);

    if (value === null) return null;

    return JSON.parse(value);
  }

  static async del(key: string) {
    await redis.del(key);
  }
}
