import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestingModuleWithDB } from '../../utils/test-utils';
import { Exchange } from '../../entities/exchange.entity';
import { ExchangeService } from './exchange.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let exchangeRepository: Repository<Exchange>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createTestingModuleWithDB(),
        TypeOrmModule.forFeature([Exchange]),
      ],
      providers: [ExchangeService],
    }).compile();
    service = module.get<ExchangeService>(ExchangeService);
    exchangeRepository = module.get<Repository<Exchange>>(
      getRepositoryToken(Exchange),
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getExchangeRate', () => {
    it('should return the exchange rate if it exists', async () => {
      const result = await service.getExchangeRate('USD', 'EUR');
      expect(result).toEqual({ origin: 'USD', destination: 'EUR', rate: 0.92 });
    });
    it('should return undefined if the exchange rate does not exist', async () => {
      const result = await service.getExchangeRate('USD', 'JPY');
      expect(result).toBeNull();
    });
  });
  describe('updateExchangeRate', () => {
    it('should update the exchange rate if it exists', async () => {
      await service.updateExchangeRate('USD', 'EUR', 1.0);
      const updatedExchange = await exchangeRepository.findOne({
        where: { origin: 'USD', destination: 'EUR' },
      });
      expect(updatedExchange.rate).toBe(1.0);
    });
    it('should throw an error if the exchange rate does not exist', async () => {
      try {
        await service.updateExchangeRate('USD', 'JPY', 1.5);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Error updating exchange rate');
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
