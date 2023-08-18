import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionUser1692260140102 implements MigrationInterface {
    name = 'AddPermissionUser1692260140102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`permission\` varchar(255) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`permission\``);
    }

}
