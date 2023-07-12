import { MigrationInterface, QueryRunner } from "typeorm";

export class GenetateAddAvatarFieldUserTable1688305672898 implements MigrationInterface {
    name = 'GenetateAddAvatarFieldUserTable1688305672898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
