import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { User } from '../entities/auth/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/presentation/dtos/auth/user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userDto:UserDto): Promise<UserDto> {
    throw new Error('Method not implemented.');
  }
}