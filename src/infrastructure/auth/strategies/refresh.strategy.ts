import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IUserService } from "src/core/interfaces/services/user-service.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject('IUserService')
        private userService:IUserService,
        config:ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.get('REFRESH_SECRET'),
        });
    }

    async validate(payload: any) {
        const authUser = await this.userService.findById(payload.sub);
        if (!authUser) {
            throw new UnauthorizedException();
        }
        return {
            attributes: authUser,
            refreshTokenExpiresAt: new Date(payload.exp * 1000),
        };
    }
}