import { injectable } from 'tsyringe';

import { AppError } from '@shared/error/errors';
import { HttpStatusCode } from '@shared/utils/response';

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
    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followerId
    );

    if (!isFollowing) {
      throw new AppError(
        HttpStatusCode.badRequest,
        'User not followed',
        'USER_NOT_FOLLOWED'
      );
    }

    await this.followRepository.deleteFollow(userId, followerId);

    return true;
  }
}
