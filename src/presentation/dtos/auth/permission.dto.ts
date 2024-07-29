import { Permission } from "src/core/entities/auth/permission.entity";

export class PermissionDto {
    name: string;
    description?: string;

    constructor(permission?: Permission) {
        if (permission) {
            this.name = permission.name;
            this.description = permission.description;
        }
    }
}