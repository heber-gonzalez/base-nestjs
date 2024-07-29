import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository

  ) {}

  async execute(username: string, password: string): Promise<string> {
    console.log(username, password)
    const user = await this.userRepository.findByUsername(username);
    console.log(user)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Here you would generate and return a JWT token
    return 'jwt_token';
  }
}