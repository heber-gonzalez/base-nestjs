import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/core/entities/auth/refreshToken.entity";
import { IRefreshTokenRepository } from "src/core/interfaces/repositories/refreshToken-repository.interface";
import { Repository } from "typeorm";

export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>
    ) {}
    async findByUserId(id: number): Promise<RefreshToken> {
        return await this.refreshTokenRepository.findOne({ 
            where: { user: { id } },
            relations: ['user']
        });
    }
    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
        const token = this.refreshTokenRepository.create(refreshToken);
        return await this.refreshTokenRepository.save(token);

    }
    async update(refreshToken: RefreshToken): Promise<RefreshToken> {
        return await this.refreshTokenRepository.save(refreshToken);
    }
    async delete(id: number): Promise<void> {
        await this.refreshTokenRepository.delete(id);
    }

    async save(refreshToken: RefreshToken): Promise<RefreshToken> {
        return await this.refreshTokenRepository.save(refreshToken);
    }

}