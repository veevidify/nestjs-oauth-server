import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAccessTokens1617353084774 implements MigrationInterface {
    name = 'UserAccessTokens1617353084774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_token" ADD "userId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{ user }'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" ADD CONSTRAINT "UQ_586233caf7e281dc24aaedd1335" UNIQUE ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" ADD CONSTRAINT "UQ_f20f028607b2603deabd8182d12" UNIQUE ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "UQ_b575dd3c21fb0831013c909e7fe" UNIQUE ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" ADD CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9"`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "UQ_b575dd3c21fb0831013c909e7fe"`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "UQ_f20f028607b2603deabd8182d12"`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" DROP CONSTRAINT "UQ_586233caf7e281dc24aaedd1335"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '{user}'`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" DROP COLUMN "userId"`, undefined);
    }

}
