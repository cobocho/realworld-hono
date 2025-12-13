import { injectable } from 'tsyringe';

import { FollowRepository } from '../repositories/follow-repository';
import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class GetProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followRepository: FollowRepository
  ) {}

  async execute(targetUserId: string, requesterUserId?: string) {
    const { hash_password: _, ...user } =
      await this.usersRepository.findByUserId(targetUserId);

    console.log('targetUserId', targetUserId);
    console.log('requesterUserId', requesterUserId);

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
