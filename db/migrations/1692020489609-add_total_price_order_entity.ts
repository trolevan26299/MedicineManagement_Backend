import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalPriceOrderEntity1692020489609 implements MigrationInterface {
    name = 'AddTotalPriceOrderEntity1692020489609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`total_price\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`total_price\``);
    }

}
