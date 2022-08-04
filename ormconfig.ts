import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'task-organizer',
  entities: ['dist/src/**/*.entity.js'],
  synchronize: false,
};

export default config;
