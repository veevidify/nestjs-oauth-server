import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAccessTokens1617353084774 implements MigrationInterface {
    name = 'UserAccessTokens1617353084774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_token" ADD "userId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{ user }'::text[]`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{user}'`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" DROP COLUMN "userId"`, undefined);
    }

}
