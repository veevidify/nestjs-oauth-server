import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRoles1587817516130 implements MigrationInterface {
    name = 'UserRoles1587817516130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" text array NOT NULL DEFAULT '{ user }'::text[]`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`, undefined);
    }

}
