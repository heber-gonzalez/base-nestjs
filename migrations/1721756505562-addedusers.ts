import { MigrationInterface, QueryRunner } from "typeorm";

export class Addedusers1721756505562 implements MigrationInterface {
    name = 'Addedusers1721756505562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`expirationDate\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`names\` varchar(255) NOT NULL, \`firstLastName\` varchar(255) NOT NULL, \`secondLastName\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`hashedPassword\` varchar(255) NOT NULL, \`employeeId\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permissions_permission\` (\`userId\` int NOT NULL, \`permissionId\` int NOT NULL, INDEX \`IDX_5b72d197d92b8bafbe7906782e\` (\`userId\`), INDEX \`IDX_c43a6a56e3ef281cbfba9a7745\` (\`permissionId\`), PRIMARY KEY (\`userId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45c0d39d1f9ceeb56942db93cc5\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions_permission\` ADD CONSTRAINT \`FK_5b72d197d92b8bafbe7906782ec\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_permissions_permission\` ADD CONSTRAINT \`FK_c43a6a56e3ef281cbfba9a77457\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions_permission\` DROP FOREIGN KEY \`FK_c43a6a56e3ef281cbfba9a77457\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions_permission\` DROP FOREIGN KEY \`FK_5b72d197d92b8bafbe7906782ec\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45c0d39d1f9ceeb56942db93cc5\``);
        await queryRunner.query(`DROP INDEX \`IDX_c43a6a56e3ef281cbfba9a7745\` ON \`user_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_5b72d197d92b8bafbe7906782e\` ON \`user_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`user_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}
