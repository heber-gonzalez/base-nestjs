import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Permission } from 'src/core/entities/auth/permission.entity';
import { User } from 'src/core/entities/auth/user.entity';
import { IAuthService } from 'src/core/interfaces/services/auth-service.interface';
import { IPermissionService } from 'src/core/interfaces/services/permission-service';
import { ITokenService } from 'src/core/interfaces/services/token-service.interface';
import { IUserService } from 'src/core/interfaces/services/user-service.interface';
import { RegisterDto } from 'src/presentation/dtos/auth/registerDto';
import { TokensDto } from 'src/presentation/dtos/auth/tokens.dto';
import { UserDto } from 'src/presentation/dtos/auth/user.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserService')
    private userService: IUserService,
    @Inject('ITokenService')
    private tokenService: ITokenService,
    @Inject('IPermissionService')
    private permissionService: IPermissionService
  ) {}
  register(registerDto: RegisterDto): Promise<User> {
    return this.userService.create(registerDto);
  }
  async refreshTokens(refreshToken: string): Promise<TokensDto> {
    const userId = await this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.tokenService.getTokens(user);
  }
  async editUser(userDto: UserDto): Promise<User> {
    return await this.userService.editUser(userDto);
  }
  async restorePassword(userId: number, newPassword: string): Promise<User> {
    return await this.userService.restorePassword(userId, newPassword);
  }

  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }
  async getAllDto(): Promise<UserDto[]> {
    return await this.userService.getAllDto();
  }
  async findByIdDto(id: number): Promise<UserDto> {
    return await this.userService.findByIdDto(id);
  }
  async getPermissions(): Promise<Permission[]> {
    return await this.permissionService.getAll();
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.hashedPassword)) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<TokensDto> {
    
    const tokens = await this.tokenService.getTokens(user);
    await this.renovateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

  

  private async renovateRefreshToken(user: User, refreshToken: string): Promise<void> {
    await this.tokenService.renovateRefreshToken(user, refreshToken);
  }
}