import { Test, TestingModule } from '@nestjs/testing';

import { currencyExchangeDB } from '../utils/config';
import { ExchangeService } from './exchange.service';

describe('ExchangeService', () => {
  let service: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeService],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('should return the exchange rate if it exists', () => {
      const result = service.getExchangeRate('USD', 'EUR');

      expect(result).toEqual({ origin: 'USD', destination: 'EUR', rate: 0.92 });
    });

    it('should return undefined if the exchange rate does not exist', () => {
      const result = service.getExchangeRate('USD', 'JPY');

      expect(result).toBeUndefined();
    });
  });

  describe('updateExchangeRate', () => {
    it('should update the exchange rate if it exists', () => {
      service.updateExchangeRate('USD', 'EUR', 1.0);

      expect(
        currencyExchangeDB.find(
          (entry) => entry.origin === 'USD' && entry.destination === 'EUR',
        ).rate,
      ).toBe(1.0);
    });

    it('should throw an error if the exchange rate does not exist', () => {
      expect(() => service.updateExchangeRate('USD', 'JPY', 1.5)).toThrowError(
        'Error updating exchange rate',
      );
    });
  });
});
