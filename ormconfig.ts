import { ConnectionOptions } from 'typeorm';

const typeormConfig: ConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_USER || 'dev',
  username: process.env.POSTGRES_USER || 'dev',
  password: process.env.POSTGRES_USER || 'dev',
  host: 'postgres',
  port: 5432,
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
