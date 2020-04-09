import { ConnectionOptions } from 'typeorm';

const typeormConfig: ConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_USER || 'dev',
  username: process.env.POSTGRES_USER || 'dev',
  password: process.env.POSTGRES_USER || 'dev',
  host: 'postgres',
  port: 5432,
  synchronize: false,
  entities: [__dirname + '/entities/*.entity.ts'],
  migrations: ['migrations/*.migration.ts'],
  logging: ['error'],
  cli: {
    migrationsDir: 'migrations',
    entitiesDir: 'entities',
  },
};

export default typeormConfig;
