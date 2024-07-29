import { MigrationInterface, QueryRunner } from "typeorm";

export class Refresh1721849124556 implements MigrationInterface {
    name = 'Refresh1721849124556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`hashedtoken\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`hashedtoken\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45c0d39d1f9ceeb56942db93cc5\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45c0d39d1f9ceeb56942db93cc5\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45c0d39d1f9ceeb56942db93cc5\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45c0d39d1f9ceeb56942db93cc5\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`hashedtoken\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`hashedtoken\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`token\` varchar(255) NOT NULL`);
    }

}
