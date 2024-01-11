import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Exchange } from '../../entities/exchange.entity';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
  ) {}

  async getExchangeRate(origin: string, destination: string) {
    return this.exchangeRepository.findOne({
      select: ['origin', 'destination', 'rate'],
      where: { origin, destination },
    });
  }

  async updateExchangeRate(origin: string, destination: string, rate: number) {
    const exchange = await this.exchangeRepository.findOne({
      where: { origin, destination },
    });

    if (!exchange) {
      throw new NotFoundException('Error updating exchange rate');
    }

    exchange.rate = rate;
    await this.exchangeRepository.save(exchange);
  }
}
