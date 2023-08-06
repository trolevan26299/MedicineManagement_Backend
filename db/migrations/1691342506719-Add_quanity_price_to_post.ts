import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuanityPriceToPost1691342506719 implements MigrationInterface {
    name = 'AddQuanityPriceToPost1691342506719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`price\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`quantity\``);
    }

}
