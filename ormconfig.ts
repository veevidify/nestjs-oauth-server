import { ConnectionOptions } from 'typeorm';

const typeormConfig: ConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DB || 'dev',
  username: process.env.POSTGRES_USER || 'dev',
  password: process.env.POSTGRES_PASS || 'dev',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  synchronize: false,
  entities: [__dirname + '/src/entities/*.entity.ts'],
  migrations: ['src/migrations/*.migration.ts'],
  logging: ['error'],
  cli: {
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/entities',
  },
};

export = typeormConfig;
