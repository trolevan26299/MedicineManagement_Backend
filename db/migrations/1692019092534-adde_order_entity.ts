import { MigrationInterface, QueryRunner } from "typeorm";

export class AddeOrderEntity1692019092534 implements MigrationInterface {
    name = 'AddeOrderEntity1692019092534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`usersId\` int NULL, \`customerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`orderId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_15d817ff19ae88ce95bb0bb2ce5\` FOREIGN KEY (\`usersId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_124456e637cca7a415897dce659\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_2256e452fa85aef4e2802d49422\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_2256e452fa85aef4e2802d49422\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_124456e637cca7a415897dce659\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_15d817ff19ae88ce95bb0bb2ce5\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`DROP TABLE \`order\``);
    }

}
