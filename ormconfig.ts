import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [__dirname + '/src/**/*.entity.js'],
  migrations: [__dirname + '/src/migrations/*.js'],
  migrationsRun: true,
});
