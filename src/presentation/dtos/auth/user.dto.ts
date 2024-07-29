import { User } from "src/core/entities/auth/user.entity";
import { PermissionDto } from "./permission.dto";


export class UserDto {

    constructor(user?: User) {
        if (user) {
            this.id = user.id;
            this.username = user.username;
            this.names = user.names;
            this.firstLastName = user.firstLastName;
            this.secondLastName = user.secondLastName;
            this.employeeId = user.employeeId;
            this.permissions = user.permissions.map(permission => new PermissionDto(permission));
            this.status = user.status;
        }
    }
    id?: number;
    username: string;
    password: string;
    names: string;
    firstLastName: string;
    secondLastName?: string;
    employeeId?: string;
    permissions: PermissionDto[];
    permissionIds?: number[];
    status: boolean;
}