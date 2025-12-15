import { injectable } from 'tsyringe';

import { AppError } from '@shared/error/errors';
import { HttpStatusCode } from '@shared/utils/response';

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
      throw new AppError(
        HttpStatusCode.badRequest,
        'User not found',
        'USER_NOT_FOUND'
      );
    }

    const existingFollower =
      await this.usersRepository.findByUserId(followerId);

    if (!existingFollower) {
      throw new AppError(
        HttpStatusCode.badRequest,
        'Follower not found',
        'FOLLOWER_NOT_FOUND'
      );
    }

    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followerId
    );

    if (isFollowing) {
      throw new AppError(
        HttpStatusCode.badRequest,
        'User already followed',
        'USER_ALREADY_FOLLOWED'
      );
    }

    await this.followRepository.upsertFollow(userId, followerId);

    const followingUser = await this.usersRepository.findByUserId(userId);

    return followingUser;
  }
}
