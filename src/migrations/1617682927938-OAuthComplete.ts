import {MigrationInterface, QueryRunner} from "typeorm";

export class OAuthComplete1617682927938 implements MigrationInterface {
    name = 'OAuthComplete1617682927938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{ user }'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "redirectUris" SET DEFAULT '{ user }'::text[]`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "redirectUris" SET DEFAULT '{user}'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{user}'`, undefined);
    }

}
