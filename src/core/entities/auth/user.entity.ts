import { Entity, Column, ManyToMany, OneToMany, ManyToOne, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { RefreshToken } from './refreshToken.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class User extends BaseEntity {
    @Column({ nullable: false })
    names: string;

    @Column({ nullable: false })
    firstLastName: string;

    @Column({ nullable: true })
    secondLastName: string;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    hashedPassword: string;

    @Column({ nullable: true })
    employeeId: string;

    @ManyToOne(() => User, (user) => user.createdUsers, { nullable: true })
    createdBy?: User;

    @OneToMany(() => User, (user) => user.createdBy, { nullable: true })
    createdUsers: User[];

    @ManyToMany(() => Permission, permission => permission.users, { nullable: true })
    @JoinTable()
    permissions: Permission[];

    @OneToOne(() => RefreshToken, refreshToken => refreshToken.user, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    refreshToken: RefreshToken;
}