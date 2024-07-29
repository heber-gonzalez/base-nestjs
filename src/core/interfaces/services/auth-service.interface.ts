import { Permission } from "src/core/entities/auth/permission.entity";
import { User } from "src/core/entities/auth/user.entity";
import { RegisterDto } from "src/presentation/dtos/auth/registerDto";
import { TokensDto } from "src/presentation/dtos/auth/tokens.dto";
import { UserDto } from "src/presentation/dtos/auth/user.dto";

export interface IAuthService {
    register(registerDto: RegisterDto): Promise<User>;
    login(user: User): Promise<TokensDto>;
    refreshTokens(refreshToken: string): Promise<TokensDto>;
    editUser(userDto: UserDto): Promise<User>;
    restorePassword(userId: number, newPassword: string): Promise<User>;
    getAll(): Promise<User[]>
    getAllDto(): Promise<UserDto[]>
    findByIdDto(id: number): Promise<UserDto>;
    getPermissions(): Promise<Permission[]>
    validateUser(username: string, password: string): Promise<User>;
}