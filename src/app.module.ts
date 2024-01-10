import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from './exchange/exchange.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ExchangeModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
