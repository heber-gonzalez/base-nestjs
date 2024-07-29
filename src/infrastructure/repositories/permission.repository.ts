import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/core/entities/auth/permission.entity";
import { IPermissionRepository } from "src/core/interfaces/repositories/permission-repository.interface";
import { Repository } from "typeorm";

export class PermissionRepository implements IPermissionRepository {

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}
    async getAll(): Promise<Permission[]> {
        return await this.permissionRepository.find();
    }
    async findById(id: number): Promise<Permission> {
        return await this.permissionRepository.findOneBy({ id });
    }
    async findByName(name: string): Promise<Permission> {
        return await this.permissionRepository.findOneBy({ name });
    }

async getByUserId(id: number): Promise<Permission[]> {
    return await this.permissionRepository.find({
        where: {
            users: {
                id: id
            }
        },
        relations: {
            users: true
        }
    });
}
}