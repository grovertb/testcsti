import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from './modules/exchange/exchange.module';
import { AuthModule } from './modules/auth/auth.module';
import entities from './entities';

@Module({
  imports: [
    ExchangeModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities,
      migrationsRun: true,
      migrations: [__dirname + '/migrations/*.js'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
