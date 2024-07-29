import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {  
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false })
    hashedtoken: string;
    
    @Column({ nullable: false })
    expirationDate: Date;

    @OneToOne(() => User, user => user.refreshToken, { onDelete: 'SET NULL' })
    user: User;

}