import { injectable } from 'tsyringe';

import { AppError } from '@shared/error/errors';
import { HttpStatusCode } from '@shared/utils/response';

import type { FollowUserParamsDto } from '../model/follow-user.dto';
import { FollowRepository } from '../repositories/follow-repository';
import { UsersRepository } from '../repositories/users-repository';
import { UserDomainService } from '../services/user-domain-service';

@injectable()
export class FollowUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository,
    private readonly userDomainService: UserDomainService
  ) {}

  async execute({
    userId,
    followerId,
  }: FollowUserParamsDto & { followerId: string }) {
    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followerId
    );

    try {
      this.userDomainService.validateFollowAction(followerId, userId, isFollowing);
    } catch (error) {
      throw new AppError(
        HttpStatusCode.badRequest,
        error instanceof Error ? error.message : 'Follow validation failed',
        'FOLLOW_VALIDATION_ERROR'
      );
    }

    await this.followRepository.upsertFollow(userId, followerId);

    const followingUser = await this.usersRepository.findByUserId(userId);

    return followingUser;
  }
}
