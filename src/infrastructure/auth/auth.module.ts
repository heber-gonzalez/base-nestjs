// auth module

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserUseCase } from 'src/core/usecases/register-user.usecase';
import { LoginUserUseCase } from 'src/core/usecases/login-user.usecase';
import { UserRepository } from '../repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/entities/auth/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './users/user.service';
import { JwtRefreshStrategy } from './strategies/refresh.strategy';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionService } from './users/permission.service';
import { Permission } from 'src/core/entities/auth/permission.entity';
import { RefreshToken } from 'src/core/entities/auth/refreshToken.entity';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { TokenService } from './users/token.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '30m',
              },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Permission, RefreshToken]),
    ],
    controllers: [AuthController],
    providers: [
        RegisterUserUseCase,
        LoginUserUseCase,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        {
            provide: 'IPermissionRepository',
            useClass: PermissionRepository,
        },
        {
            provide: 'IRefreshTokenRepository',
            useClass: RefreshTokenRepository,
        },
        {
            provide: 'IUserService',
            useClass: UserService,
        },
        {
            provide: 'IPermissionService',
            useClass: PermissionService,
        },
        {
            provide: 'ITokenService',
            useClass: TokenService,
        },
        {
            provide: 'IAuthService',
            useClass: AuthService,
        },

        AuthService
    ],
    exports: [AuthService],
})
export class AuthModule {}