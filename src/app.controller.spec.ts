// import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import entities from './entities';

describe('AppController', () => {
  // let appController: AppController;

  // beforeEach(async () => {
  //   const app: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       TypeOrmModule.forRoot({
  //         type: 'sqlite',
  //         database: ':memory:',
  //         entities,
  //         migrationsRun: true,
  //         migrations: ['src/migrations/*.ts'],
  //         synchronize: true,
  //       }),
  //     ],
  //     controllers: [AppController],
  //     providers: [AppService],
  //   }).compile();

  //   appController = app.get<AppController>(AppController);
  // });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
