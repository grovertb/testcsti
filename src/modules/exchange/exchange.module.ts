import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { Exchange } from '../../entities/exchange.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange])],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
