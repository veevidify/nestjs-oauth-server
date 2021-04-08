import {MigrationInterface, QueryRunner} from "typeorm";

export class CompleteMigration1617706097169 implements MigrationInterface {
    name = 'CompleteMigration1617706097169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "roles" text array NOT NULL DEFAULT '{ user }'::text[], "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_72da1f98d8d8a4f2fb77754e2e0" UNIQUE ("id", "username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "authorization_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorizationCode" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "redirectUri" character varying NOT NULL, "scope" text array NOT NULL DEFAULT '{*}'::text[], "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" uuid, "userId" uuid, CONSTRAINT "UQ_586233caf7e281dc24aaedd1335" UNIQUE ("id"), CONSTRAINT "PK_586233caf7e281dc24aaedd1335" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "clientId" character varying NOT NULL, "clientSecret" character varying NOT NULL, "redirectUris" text array NOT NULL DEFAULT '{}'::text[], "isTrusted" boolean NOT NULL, "grants" text array NOT NULL DEFAULT '{}'::text[], "accessTokenLifetime" integer NOT NULL DEFAULT 3600, "refreshTokenLifetime" integer NOT NULL DEFAULT 3600, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7dc70cd113ee83b28e2141ac8a1" UNIQUE ("id", "clientId"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "access_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accessToken" character varying NOT NULL, "accessTokenExpiresAt" TIMESTAMP NOT NULL DEFAULT '"2021-04-06T10:48:20.396Z"', "refreshToken" character varying DEFAULT null, "refreshTokenExpiresAt" TIMESTAMP DEFAULT null, "scope" text array NOT NULL DEFAULT '{*}'::text[], "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" uuid, "userId" uuid, CONSTRAINT "UQ_f20f028607b2603deabd8182d12" UNIQUE ("id"), CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" uuid, "userId" uuid, CONSTRAINT "UQ_b575dd3c21fb0831013c909e7fe" UNIQUE ("id"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" ADD CONSTRAINT "FK_ffbeadc85eea5dabbbcaf4f6b0e" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" ADD CONSTRAINT "FK_c84c3d4d0e6344f36785f679e47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" ADD CONSTRAINT "FK_c425901c1f66598550020494008" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" ADD CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_f6f07caa0ec6df39d56b0aa9f62" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_f6f07caa0ec6df39d56b0aa9f62"`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9"`, undefined);
        await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "FK_c425901c1f66598550020494008"`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" DROP CONSTRAINT "FK_c84c3d4d0e6344f36785f679e47"`, undefined);
        await queryRunner.query(`ALTER TABLE "authorization_code" DROP CONSTRAINT "FK_ffbeadc85eea5dabbbcaf4f6b0e"`, undefined);
        await queryRunner.query(`DROP TABLE "refresh_token"`, undefined);
        await queryRunner.query(`DROP TABLE "access_token"`, undefined);
        await queryRunner.query(`DROP TABLE "client"`, undefined);
        await queryRunner.query(`DROP TABLE "authorization_code"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
