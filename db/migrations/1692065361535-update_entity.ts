import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1692065361535 implements MigrationInterface {
    name = 'UpdateEntity1692065361535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_88850b85b38a8a2ded17a1f5369\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_f170e2ee57a3d879000678f5994\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD \`order_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD \`post_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_a6ac5c99b8c02bd4ee53d3785be\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_f626a585c81471495373d1a68fd\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_f626a585c81471495373d1a68fd\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_a6ac5c99b8c02bd4ee53d3785be\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP COLUMN \`post_id\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP COLUMN \`order_id\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD \`orderId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_f170e2ee57a3d879000678f5994\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_88850b85b38a8a2ded17a1f5369\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
