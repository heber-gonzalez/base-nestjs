import { BadRequestException, HttpException, Inject, NotFoundException } from "@nestjs/common";
import { User } from "src/core/entities/auth/user.entity";
import { IUserRepository } from "src/core/interfaces/repositories/user-repository.interface";
import { IUserService } from "src/core/interfaces/services/user-service.interface";
import { UserDto } from "src/presentation/dtos/auth/user.dto";
import * as bcrypt from 'bcrypt';
import { IPermissionService } from "src/core/interfaces/services/permission-service";
import { Permission } from "src/core/entities/auth/permission.entity";
import { RegisterDto } from "src/presentation/dtos/auth/registerDto";


export class UserService implements IUserService {
    constructor(
        @Inject('IUserRepository')
        private userRepository: IUserRepository,
        @Inject('IPermissionService')
        private readonly permissionService: IPermissionService
    ) {}
    async create(registerDto: RegisterDto): Promise<User> {
        await this.validateRegisterDto(registerDto);
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user: User = new User();
        user.username = await this.generateUsername(registerDto.names, registerDto.firstLastName, registerDto.secondLastName);
        user.names = registerDto.names;
        user.firstLastName = registerDto.firstLastName;
        user.secondLastName = registerDto.secondLastName;
        user.employeeId = registerDto.employeeId;
        user.hashedPassword = hashedPassword;
        try {
            const createdUser = await this.userRepository.create(user);
            if(registerDto.permissions && registerDto.permissions.length > 0) {
                await this.addPermissionsToUser(createdUser, registerDto.permissions);
            }
            return createdUser;
        } catch (error) {
            throw new HttpException(error.message, 500);
        }
    }

    private async validateRegisterDto(registerDto: RegisterDto): Promise<void> {
        if (!registerDto || !registerDto.names || !registerDto.firstLastName || !registerDto.password) {
            throw new BadRequestException('Invalid register data');
        }

        if (registerDto.password.length < 8) {
            throw new BadRequestException('Password must be at least 8 characters long');
        }

        if (registerDto.names.length < 3 || registerDto.firstLastName.length < 3) {
            throw new BadRequestException('Names must be at least 3 characters long');
        }

    }

    private async generateUsername(names: string, firstLastName: string, secondLastName?: string): Promise<string> {
        // Normalize all strings to lowercase and remove accents
        names = this.normalizeString(names);
        firstLastName = this.normalizeString(firstLastName);
        secondLastName = secondLastName ? this.normalizeString(secondLastName) : null;

        // Get the first part of each name
        const firstName = names.split(' ')[0];
        const firstLN = firstLastName.split(' ')[0];
        const secondLN = secondLastName ? secondLastName.split(' ')[0] : "";

        let username = `${firstName}.${firstLN}`;
        let secondLNUsed = false;

        // Check if the username already exists, if yes, append a number
        let i = 1;
        const usernameRegex = /[0-9]*$/;
        while (await this.usernameExists(username)) {
            if (secondLN && secondLN.length > 1 && !secondLNUsed) {
                const additional = `.${secondLN.substring(0, 2)}`;
                username += additional;
                secondLNUsed = true;
            } 
            else {
                username = username.replace(usernameRegex, '') + `${i++}`;
            }
        }
        return username;
    }

    private normalizeString(string: string): string {
        return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    private async usernameExists(username: string): Promise<boolean> {
        return await this.userRepository.findByUsername(username) !== null;
    }

    private async addPermissionsToUser(user: User, permissions: number[]): Promise<void> {
        const userPermissions = await this.permissionService.getPermissionsByUserId(user.id);
        for (const permission of permissions) {
            const permissionToAdd = await this.permissionService.findById(permission);
            if (permissionToAdd !== null) {
                // check if the user already has the permission
                if (!userPermissions.find(p => p === permissionToAdd)) {
                    await this.addPermissionToUser(user, permissionToAdd);
                }
            }
        }
    }

    private async addPermissionToUser(user: User, permission: Permission): Promise<void> {
        await this.userRepository.addPermissionToUser(user, permission);
    }

    private async removePermissionsFromUser(user: User, permissions: number[]): Promise<void> {
        const userPermissions = await this.permissionService.getPermissionsByUserId(user.id);
        for (const permission of permissions) {
            const permissionToRemove = await this.permissionService.findById(permission);
            if (permissionToRemove !== null) {
                // check if the user already has the permission
                if (userPermissions.find(p => p.id === permissionToRemove.id)) {
                    await this.removePermissionFromUser(user, permissionToRemove);
                }
            }
        }
    }

    private async removePermissionFromUser(user: User, permission: Permission): Promise<void> {
        await this.userRepository.removePermissionFromUser(user, permission);
    }


    async editUser(userDto: UserDto): Promise<User> {
        if(!userDto.id) throw new BadRequestException('User id is required');
        const user: User = await this.userRepository.findById(userDto.id);
        if(!user) throw new NotFoundException('User not found');
        if(userDto.status !== undefined && userDto.status !== null) user.status = userDto.status;
        if(userDto.names !== undefined && userDto.names !== null) user.names = userDto.names;
        if(userDto.firstLastName !== undefined && userDto.firstLastName !== null) user.firstLastName = userDto.firstLastName;
        if(userDto.secondLastName !== undefined && userDto.secondLastName !== null) user.secondLastName = userDto.secondLastName;
        if(userDto.employeeId !== undefined && userDto.employeeId !== null) user.employeeId = userDto.employeeId;
        if(userDto.username !== undefined && userDto.username !== null) {
            if(await this.usernameExists(userDto.username) && user.username !== userDto.username) throw new BadRequestException('Username already exists');
            user.username = userDto.username;
        }
        if(userDto.permissionIds !== undefined && userDto.permissionIds !== null) {
            await this.editPermissions(user, userDto.permissionIds);
        }

        return await this.userRepository.update(user);
        
    }

    private async editPermissions(user: User, permissions: number[]): Promise<void> {
        const userPermissions = await this.permissionService.getPermissionsByUserId(user.id);
        const permissionsToAdd = permissions.filter(p => !userPermissions.find(up => up.id === p));
        const permissionsToRemove = userPermissions.filter(p => !permissions.find(up => up === p.id));
        await this.removePermissionsFromUser(user, permissionsToRemove.map(p => p.id));
        await this.addPermissionsToUser(user, permissionsToAdd);
    }

    async restorePassword(userId: number, newPassword: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if(!user) throw new NotFoundException('User not found');
        if(newPassword.length < 8) throw new BadRequestException('Password must be at least 8 characters long');
        user.hashedPassword = await bcrypt.hash(newPassword, 10);
        return await this.userRepository.update(user);
    }

    async getAll(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async getAllDto(): Promise<UserDto[]> {
        const users = await this.userRepository.getAll();
        return users.map(user => new UserDto(user));
    }

    async findById(id: number): Promise<User> {
        return await this.userRepository.findById(id);
    }

    async findByIdDto(id: number): Promise<UserDto> {
        const user = await this.userRepository.findById(id);
        return new UserDto(user);
    }

    async findByUsername(username: string): Promise<User> {
        return await this.userRepository.findByUsername(username);
    }

    async findByUsernameDto(username: string): Promise<UserDto> {
        const user = await this.userRepository.findByUsername(username);
        return new UserDto(user);
    }



}