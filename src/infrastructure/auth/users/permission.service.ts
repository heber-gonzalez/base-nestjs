import { Inject } from "@nestjs/common";
import { Permission } from "src/core/entities/auth/permission.entity";
import { IPermissionRepository } from "src/core/interfaces/repositories/permission-repository.interface";
import { IPermissionService } from "src/core/interfaces/services/permission-service";

export class PermissionService implements IPermissionService {

    constructor(
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository
    ) {}


    async getAll(): Promise<Permission[]> {
        return await this.permissionRepository.getAll();
    }
    async findById(id: number): Promise<Permission> {
        return await this.permissionRepository.findById(id);
    }
    async findByName(name: string): Promise<Permission> {
        return await this.permissionRepository.findByName(name);
    }

    async getPermissionsByUserId(id: number): Promise<Permission[]> {
        return await this.permissionRepository.getByUserId(id);
    }

}