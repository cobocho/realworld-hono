import { injectable } from 'tsyringe';

import { BadRequestError, NotFoundError } from '@shared/error/errors';

import type { UnfollowUserParamsDto } from '../model/unfollow-user.dto';
import { FollowRepository } from '../repositories/follow-repository';
import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository
  ) {}

  async execute({
    followerId,
    userId,
  }: UnfollowUserParamsDto & { followerId: string }) {
    const followers = await this.followRepository.getFollowers(userId);

    if (!followers.includes(followerId)) {
      throw new BadRequestError('User not followed');
    }

    const existingUser = await this.usersRepository.findByUserId(userId);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const existingFollower =
      await this.usersRepository.findByUserId(followerId);

    if (!existingFollower) {
      throw new NotFoundError('Follower not found');
    }

    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followerId
    );

    if (!isFollowing) {
      throw new BadRequestError('User not followed');
    }

    await this.followRepository.deleteFollow(userId, followerId);

    return true;
  }
}
