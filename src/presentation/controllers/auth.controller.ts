import { Body, Controller, Get, Post, UseGuards, Request, Inject, BadRequestException, Put, Patch } from '@nestjs/common';
import { UserDto } from '../dtos/auth/user.dto';
import { LocalAuthGuard } from 'src/infrastructure/auth/guards/local.guard';
import { JwtGuard } from 'src/infrastructure/auth/guards/jwt.guard';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/infrastructure/auth/guards/roles.guard';
import { IAuthService } from 'src/core/interfaces/services/auth-service.interface';
import { RegisterDto } from '../dtos/auth/registerDto';
import { RefreshTokenDto } from '../dtos/auth/refresh.dto';
import { RestorePasswordDto } from '../dtos/auth/restorePassword.dto';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('IAuthService')
        private readonly authService: IAuthService,
      ) {}

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('Admin')
    @Get('users')
    async findAll(): Promise<UserDto[]> {
        try {
            return await this.authService.getAllDto();
        }
        catch (error) {
            throw new BadRequestException(error);
        }
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('Admin')
    @Get('user/:id')
    async findById(@Request() req): Promise<UserDto> {
        try {
            // validate id is number
            if (isNaN(req.params.id)) {
                throw new BadRequestException('Id must be a number');
            }
            return await this.authService.findByIdDto(req.params.id);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('Admin')
    @Post('user/register')
    async register(@Body() registerDto:RegisterDto): Promise<any> {
        try {
            const user = await this.authService.register(registerDto);
            return {
                username: user.username,
            };
        }
        catch (error) {
            throw new BadRequestException(error);
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('user/login')
    async login(@Request() req): Promise<any> {
        return await this.authService.login(req.user);
    }

    @Post('user/refresh')
    async refreshTokens(@Body() refresh: RefreshTokenDto): Promise<any> {
        return await this.authService.refreshTokens(refresh.refreshToken);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('Admin')
    @Patch('user/edit')
    async editUser(@Body() userDto: UserDto): Promise<any> {
        try {
            return await this.authService.editUser(userDto);
        }
        catch (error) {
            console.log(error)
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('Admin')
    @Put('user/restore_password')
    async restorePassword(@Body() restorePasswordDto: RestorePasswordDto): Promise<any> {
        try {
            return await this.authService.restorePassword(restorePasswordDto.userId, restorePasswordDto.newPassword);
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('Admin')
    @Get('permissions')
    async getPermissions(): Promise<any> {
        try {
            return await this.authService.getPermissions();
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
