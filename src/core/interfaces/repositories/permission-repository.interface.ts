import { Permission } from "src/core/entities/auth/permission.entity";


export interface IPermissionRepository {
    getAll(): Promise<Permission[]>;
    findById(id: number): Promise<Permission>;
    findByName(name: string): Promise<Permission>;
    getByUserId(id: number): Promise<Permission[]>
}