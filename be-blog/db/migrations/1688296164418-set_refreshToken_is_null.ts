import { MigrationInterface, QueryRunner } from "typeorm";

export class SetRefreshTokenIsNull1688296164418 implements MigrationInterface {
    name = 'SetRefreshTokenIsNull1688296164418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
