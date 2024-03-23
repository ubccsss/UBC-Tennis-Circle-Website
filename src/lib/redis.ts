import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.NEXT_UPSTASH_URL,
  token: process.env.NEXT_UPSTASH_TOKEN,
});

export class Cache {
  static async fetch<T>(key: string, fetcher: () => T, expires: number) {
    const existing = await this.get<T>(key);

    if (existing !== null) return existing;

    return this.set(key, fetcher, expires);
  }

  static async set<T>(key: string, fetcher: () => T, expires: number) {
    const value = await fetcher();
    await redis.set(key, value, { ex: expires });

    return value;
  }

  static async get<T>(key: string): Promise<T | null> {
    const value = await redis.get<T>(key);

    if (value === null) return null;

    return value;
  }

  static async del(key: string) {
    await redis.del(key);
  }
}
