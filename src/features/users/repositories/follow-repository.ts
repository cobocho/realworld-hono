import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@core/db/base-repository';
import { followings } from '@core/db/schema';

import { db } from '@integrations/database';

@injectable()
export class FollowRepository extends BaseRepository {
  async upsertFollow(userId: string, followerId: string) {
    return this.insertOne(() =>
      db.insert(followings).values({ user_id: userId, follower_id: followerId })
    );
  }

  async deleteFollow(userId: string, followerId: string) {
    return this.deleteOne(() =>
      db
        .delete(followings)
        .where(
          and(
            eq(followings.user_id, userId),
            eq(followings.follower_id, followerId)
          )
        )
    );
  }

  async isFollowing(userId: string, followerId: string) {
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

    return result !== null;
  }
}
