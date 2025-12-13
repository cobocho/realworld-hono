import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@core/db/base-repository';
import { followings } from '@core/db/schema';

import { db } from '@integrations/database';

@injectable()
export class FollowRepository extends BaseRepository {
  async createFollow(followingId: string, followedId: string) {
    return this.insertOne(() =>
      db
        .insert(followings)
        .values({ following_id: followingId, followed_id: followedId })
    );
  }

  async deleteFollow(followingId: string, followedId: string) {
    return this.deleteOne(() =>
      db
        .delete(followings)
        .where(
          and(
            eq(followings.following_id, followingId),
            eq(followings.followed_id, followedId)
          )
        )
    );
  }

  async isFollowing(followingId: string, followedId: string) {
    return (
      this.findOne(() =>
        db
          .select()
          .from(followings)
          .where(
            and(
              eq(followings.following_id, followingId),
              eq(followings.followed_id, followedId)
            )
          )
          .limit(1)
      ) !== null
    );
  }
}
