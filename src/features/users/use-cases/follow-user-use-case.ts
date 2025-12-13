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
    followingId,
    userId,
  }: FollowUserParamsDto & { followingId: string }) {
    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followingId
    );

    if (isFollowing) {
      throw new AppError(
        HttpStatusCode.badRequest,
        'User already followed',
        'USER_ALREADY_FOLLOWED'
      );
    }

    await this.followRepository.upsertFollow(userId, followingId);

    const followingUser = await this.usersRepository.findByUserId(userId);

    return followingUser;
  }
}
