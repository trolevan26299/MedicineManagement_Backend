import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityOrder1692029784200 implements MigrationInterface {
    name = 'UpdateEntityOrder1692029784200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_2256e452fa85aef4e2802d49422\``);
        await queryRunner.query(`CREATE TABLE \`order_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`count\` int NOT NULL, \`orderId\` int NULL, \`postId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_88850b85b38a8a2ded17a1f5369\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_f170e2ee57a3d879000678f5994\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_f170e2ee57a3d879000678f5994\``);
        await queryRunner.query(`ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_88850b85b38a8a2ded17a1f5369\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`orderId\` int NULL`);
        await queryRunner.query(`DROP TABLE \`order_detail\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_2256e452fa85aef4e2802d49422\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
