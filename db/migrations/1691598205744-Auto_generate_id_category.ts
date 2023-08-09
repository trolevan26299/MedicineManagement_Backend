import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerateIdCategory1691598205744 implements MigrationInterface {
    name = 'AutoGenerateIdCategory1691598205744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_1077d47e0112cad3c16bbcea6cd\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_1077d47e0112cad3c16bbcea6cd\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_1077d47e0112cad3c16bbcea6cd\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_1077d47e0112cad3c16bbcea6cd\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
