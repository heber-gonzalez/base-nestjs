import { User } from "src/core/entities/auth/user.entity";
import { RegisterDto } from "src/presentation/dtos/auth/registerDto";
import { UserDto } from "src/presentation/dtos/auth/user.dto";

export interface IUserService {
    getAll(): Promise<User[]>
    getAllDto(): Promise<UserDto[]>
    findById(id: number): Promise<User>;
    findByIdDto(id: number): Promise<UserDto>;
    findByUsername(username: string): Promise<User>;
    findByUsernameDto(username: string): Promise<UserDto>;
    create(registerDto: RegisterDto): Promise<User>;
    editUser(userDto: UserDto): Promise<User>;
    restorePassword(userId: number, newPassword: string): Promise<User>;
}