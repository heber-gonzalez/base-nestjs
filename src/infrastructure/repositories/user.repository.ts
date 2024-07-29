import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/core/entities/auth/permission.entity";
import { User } from "src/core/entities/auth/user.entity";
import { IUserRepository } from "src/core/interfaces/repositories/user-repository.interface";
import { Repository } from "typeorm";

export class UserRepository implements IUserRepository {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getAll(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['permissions'] });
        return users;
    }
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ 
            where: { id },
            relations: ['permissions']
        });
        return user;
    }
    async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({ 
            where: { username },
            relations: ['permissions']
        });
        return user;
    }

    async addPermissionToUser(user: User, permission: Permission): Promise<void> {
        if (!user.permissions) {
            user.permissions = [];  
        }
        user.permissions.push(permission);
        await this.userRepository.save(user);
    }

    async removePermissionFromUser(user: User, permission: Permission): Promise<void> {
        if (!user.permissions) {
            user.permissions = [];  
        }
        user.permissions = user.permissions.filter(p => p.id !== permission.id);
        await this.userRepository.save(user);
    }

    async create(user: User): Promise<User> {
        const newUser = await this.userRepository.save(user);
        return newUser;
    }
    async update(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}