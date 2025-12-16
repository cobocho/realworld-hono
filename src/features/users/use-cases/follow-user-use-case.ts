import { injectable } from 'tsyringe';

import { BadRequestError, NotFoundError } from '@shared/error/errors';

import type { FollowUserParamsDto } from '../model/follow-user.dto';
import { FollowRepository } from '../repositories/follow-repository';
import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class FollowUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository
  ) {}

  async execute({
    userId,
    followerId,
  }: FollowUserParamsDto & { followerId: string }) {
    const existingUser = await this.usersRepository.findByUserId(userId);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const existingFollower =
      await this.usersRepository.findByUserId(followerId);

    if (!existingFollower) {
      throw new NotFoundError('Follower not found');
    }

    if (userId === followerId) {
      throw new BadRequestError('You cannot follow yourself');
    }

    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followerId
    );

    if (isFollowing) {
      throw new BadRequestError('User already followed');
    }

    await this.followRepository.upsertFollow(userId, followerId);

    const followingUser = await this.usersRepository.findByUserId(userId);

    return followingUser;
  }
}
