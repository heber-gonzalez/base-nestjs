import { RefreshToken } from "src/core/entities/auth/refreshToken.entity";
import { User } from '../../entities/auth/user.entity';
import { TokensDto } from "src/presentation/dtos/auth/tokens.dto";

export interface ITokenService {
    findByUserId(userId: number): Promise<RefreshToken>
    verifyRefreshToken(token: string): Promise<number>
    getTokens(user: User): Promise<TokensDto>
    renovateRefreshToken(user: User, refreshToken: string): Promise<void>
}