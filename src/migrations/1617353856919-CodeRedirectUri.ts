import {MigrationInterface, QueryRunner} from "typeorm";

export class CodeRedirectUri1617353856919 implements MigrationInterface {
    name = 'CodeRedirectUri1617353856919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authorization_code" ADD "redirectUri" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{ user }'::text[]`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{user}'`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" DROP COLUMN "redirectUri"`, undefined);
    }

}
