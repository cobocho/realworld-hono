import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@core/db/base-repository';
import { followings } from '@core/db/schema';

import { db } from '@integrations/database';

import { FollowCache } from './follow-cache';

@injectable()
export class FollowRepository extends BaseRepository {
  constructor(private readonly followCache: FollowCache) {
    super();
  }

  async upsertFollow(userId: string, followerId: string) {
    const result = await this.insertOne(() =>
      db
        .insert(followings)
        .values({ user_id: userId, follower_id: followerId })
        .onConflictDoNothing()
    );

    await this.followCache.addFollower(userId, followerId);

    return result;
  }

  async deleteFollow(userId: string, followerId: string) {
    const result = await this.deleteOne(() =>
      db
        .delete(followings)
        .where(
          and(
            eq(followings.user_id, userId),
            eq(followings.follower_id, followerId)
          )
        )
    );

    await this.followCache.removeFollower(userId, followerId);

    return result;
  }

  async isFollowing(userId: string, followerId: string): Promise<boolean> {
    const isInCache = await this.followCache.isFollower(userId, followerId);
    if (isInCache) {
      return true;
    }

    const result = await this.findOne(() =>
      db
        .select()
        .from(followings)
        .where(
          and(
            eq(followings.user_id, userId),
            eq(followings.follower_id, followerId)
          )
        )
        .limit(1)
    );

    if (result) {
      await this.followCache.addFollower(userId, followerId);
      return true;
    }

    return false;
  }

  async getFollowers(userId: string): Promise<string[]> {
    const cached = await this.followCache.getFollowers(userId);

    if (cached.length > 0) {
      return cached;
    }

    const followers = await this.executeQuery(() =>
      db
        .select({ follower_id: followings.follower_id })
        .from(followings)
        .where(eq(followings.user_id, userId))
    );

    const followerIds = followers
      .map(f => f.follower_id)
      .filter((id): id is string => id !== null);

    if (followerIds.length > 0) {
      const redis = await this.followCache['redisClient'].getClient();
      const key = `user:${userId}:followers`;
      await redis.sAdd(key, followerIds);
    }

    return followerIds;
  }

  async refreshFollowersCache(userId: string): Promise<void> {
    await this.followCache.deleteFollowersCache(userId);

    await this.getFollowers(userId);
  }
}
