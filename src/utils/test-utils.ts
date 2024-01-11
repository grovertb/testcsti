import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '../entities';

export const createTestingModuleWithDB = () =>
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities,
    migrationsRun: true,
    migrations: ['src/migrations/*.ts'],
  });
