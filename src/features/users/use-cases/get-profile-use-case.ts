import { injectable } from 'tsyringe';

import { FollowRepository } from '../repositories/follow-repository';
import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class GetProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository
  ) {}

  async execute(userId: string, relatedUserId?: string) {
    const { hash_password: _, ...user } =
      await this.usersRepository.findByUserId(userId);

    if (relatedUserId && relatedUserId !== userId) {
      const isFollowing = await this.followRepository.isFollowing(
        userId,
        relatedUserId
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
