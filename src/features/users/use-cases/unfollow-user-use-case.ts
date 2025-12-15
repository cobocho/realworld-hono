import { injectable } from 'tsyringe';

import { AppError } from '@shared/error/errors';
import { HttpStatusCode } from '@shared/utils/response';

import type { UnfollowUserParamsDto } from '../model/unfollow-user.dto';
import { FollowRepository } from '../repositories/follow-repository';
import { UsersRepository } from '../repositories/users-repository';
import { UserDomainService } from '../services/user-domain-service';

@injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository,
    private readonly userDomainService: UserDomainService
  ) {}

  async execute({
    followerId,
    userId,
  }: UnfollowUserParamsDto & { followerId: string }) {
    const isFollowing = await this.followRepository.isFollowing(
      userId,
      followerId
    );

    try {
      this.userDomainService.validateUnfollowAction(followerId, userId, isFollowing);
    } catch (error) {
      throw new AppError(
        HttpStatusCode.badRequest,
        error instanceof Error ? error.message : 'Unfollow validation failed',
        'UNFOLLOW_VALIDATION_ERROR'
      );
    }

    await this.followRepository.deleteFollow(userId, followerId);

    return true;
  }
}
