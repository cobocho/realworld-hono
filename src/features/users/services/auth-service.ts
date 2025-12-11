import bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';

@injectable()
export class AuthService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
