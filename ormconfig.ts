import { ConnectionOptions } from 'typeorm';

const typeormConfig: ConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DB || 'dev',
  username: process.env.POSTGRES_USER || 'dev',
  password: process.env.POSTGRES_PASS || 'dev',
  host: 'postgres',
  port: 5432,
  synchronize: false,
  // entities: [__dirname + '/src/entities/*.entity.ts'],
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  logging: ['error'],
  cli: {
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/entities',
  },
};

export = typeormConfig;
