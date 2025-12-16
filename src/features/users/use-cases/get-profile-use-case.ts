import { injectable } from 'tsyringe';

import { NotFoundError } from '@shared/error/errors';

import type { GetProfileResponseDto } from '../model/get-profile';
import { FollowRepository } from '../repositories/follow-repository';
import { UserCache } from '../repositories/user-cache';
import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class GetProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository,
    private readonly UserCache: UserCache
  ) {}

  async execute(
    targetUserId: string,
    requesterUserId?: string
  ): Promise<GetProfileResponseDto> {
    const user = await this.usersRepository.findByUserId(targetUserId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (requesterUserId && requesterUserId !== targetUserId) {
      const isFollowing = await this.followRepository.isFollowing(
        targetUserId,
        requesterUserId
      );

      return {
        ...user,
        following: isFollowing,
      };
    }

    return {
      ...user,
      following: false,
    };
  }
}
