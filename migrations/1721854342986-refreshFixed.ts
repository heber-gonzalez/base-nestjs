import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshFixed1721854342986 implements MigrationInterface {
    name = 'RefreshFixed1721854342986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD UNIQUE INDEX \`IDX_8e913e288156c133999341156a\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45c0d39d1f9ceeb56942db93cc5\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_8e913e288156c133999341156a\` ON \`refresh_token\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD CONSTRAINT \`FK_8e913e288156c133999341156ad\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45c0d39d1f9ceeb56942db93cc5\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45c0d39d1f9ceeb56942db93cc5\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_8e913e288156c133999341156ad\``);
        await queryRunner.query(`DROP INDEX \`REL_8e913e288156c133999341156a\` ON \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdById\` \`createdById\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`employeeId\` \`employeeId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`secondLastName\` \`secondLastName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45c0d39d1f9ceeb56942db93cc5\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP INDEX \`IDX_8e913e288156c133999341156a\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP COLUMN \`userId\``);
    }

}
