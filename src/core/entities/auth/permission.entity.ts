import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Permission {  
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;
    
    @ManyToMany(() => User, user => user.permissions)
    users: User[];

    constructor(permission: Partial<Permission>) {
        Object.assign(this, permission);
    }

}