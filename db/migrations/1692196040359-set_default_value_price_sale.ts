import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValuePriceSale1692196040359 implements MigrationInterface {
    name = 'SetDefaultValuePriceSale1692196040359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`price_sale\` \`price_sale\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`price_sale\` \`price_sale\` int NOT NULL`);
    }

}
