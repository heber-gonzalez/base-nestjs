import { Inject, UnauthorizedException } from "@nestjs/common";
import { RefreshToken } from "src/core/entities/auth/refreshToken.entity";
import { IRefreshTokenRepository } from "src/core/interfaces/repositories/refreshToken-repository.interface";
import { ITokenService } from "src/core/interfaces/services/token-service.interface";
import * as jwt_decode from "jwt-decode"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokensDto } from "src/presentation/dtos/auth/tokens.dto";
import { User } from "src/core/entities/auth/user.entity";
import * as bcrypt from 'bcrypt';



export class TokenService implements ITokenService {

    constructor(
        @Inject('IRefreshTokenRepository')
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private jwtService: JwtService,
        private configService: ConfigService

    ) {}

    async findByUserId(userId: number): Promise<RefreshToken> {
        return await this.refreshTokenRepository.findByUserId(userId);
    }

    async getTokens(user: User): Promise<TokensDto> {
        const accessToken = this.createAccessToken(user);
        const refreshToken = this.createRefreshToken(user);
        const tokens = new TokensDto(accessToken, refreshToken);
        await this.renovateRefreshToken(user, refreshToken);

        return tokens;
    }

    private createAccessToken(user: User): string {
        const payload = { 
            username: user.username, 
            sub: user.id,
            permissions: user.permissions.map(permission => permission.name)
        };

        return this.jwtService.sign(payload);
    }

    private createRefreshToken(user: User): string {
        const payload = {
            sub: user.id,
        }

        return this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: this.configService.get<string>('REFRESH_SECRET')
        });
    }

    async verifyRefreshToken(refreshToken: string): Promise<number> {
        const userId = this.decodeToken(refreshToken).sub;
        const userToken = await this.refreshTokenRepository.findByUserId(userId);
        if (!userToken) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        if(userToken.expirationDate < new Date()) {
            throw new UnauthorizedException("Refresh token expired");
        }

        if(!await bcrypt.compare(refreshToken, userToken.hashedtoken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        return userId;
    }

    async renovateRefreshToken(user: User, refreshToken: string): Promise<void> {
        const token = await this.findByUserId(user.id);
        if(token) {
            await this.deleteRefreshToken(token);
        }

        const hashedToken = await this.hashToken(refreshToken);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        const newToken = new RefreshToken();
        newToken.user = user;
        newToken.hashedtoken = hashedToken;
        newToken.expirationDate = expirationDate;
        await this.refreshTokenRepository.create(newToken);
    }

    private decodeToken(token: string): any {
        return jwt_decode.jwtDecode(token);
    }

    private async hashToken(token: string): Promise<string> {
        return await bcrypt.hashSync(token, 10);
    }

    private async deleteRefreshToken(token: RefreshToken): Promise<void> {
        await this.refreshTokenRepository.delete(token.id);

    }

    

}