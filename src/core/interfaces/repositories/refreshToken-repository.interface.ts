import { RefreshToken } from "src/core/entities/auth/refreshToken.entity";


export interface IRefreshTokenRepository {
    findByUserId(id: number): Promise<RefreshToken>;
    create(refreshToken: RefreshToken): Promise<RefreshToken>;
    update(refreshToken: RefreshToken): Promise<RefreshToken>;
    delete(id: number): Promise<void>;
}