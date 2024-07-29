import { Permission } from "src/core/entities/auth/permission.entity";
import { User } from "src/core/entities/auth/user.entity";


export interface IUserRepository {
  getAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  findByUsername(username: string): Promise<User>;
  addPermissionToUser(user: User, permission: Permission): Promise<void>;
  removePermissionFromUser(user: User, permission: Permission): Promise<void>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}