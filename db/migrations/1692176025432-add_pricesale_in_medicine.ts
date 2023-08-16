import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPricesaleInMedicine1692176025432 implements MigrationInterface {
    name = 'AddPricesaleInMedicine1692176025432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`price_sale\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`price_sale\``);
    }

}
