import { Permission } from "src/core/entities/auth/permission.entity";

export interface IPermissionService {
    getAll(): Promise<Permission[]>;
    findById(id: number): Promise<Permission>;
    findByName(name: string): Promise<Permission>;
    getPermissionsByUserId(id: number): Promise<Permission[]>;
}