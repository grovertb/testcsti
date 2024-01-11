import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createTestingModuleWithDB } from '../../utils/test-utils';
import { ExchangeController } from './exchange.controller';
import { Exchange } from '../../entities/exchange.entity';
import { ExchangeService } from './exchange.service';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let exchangeService: ExchangeService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createTestingModuleWithDB(),
        TypeOrmModule.forFeature([Exchange]),
      ],
      controllers: [ExchangeController],
      providers: [ExchangeService],
    }).compile();
    controller = module.get<ExchangeController>(ExchangeController);
    exchangeService = module.get<ExchangeService>(ExchangeService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('calculateExchange', () => {
    it('should return converted amount if exchange rate found', async () => {
      jest.spyOn(exchangeService, 'getExchangeRate').mockResolvedValue({
        origin: 'USD',
        destination: 'EUR',
        rate: 1.5,
      } as Exchange);
      const result = await controller.calculateExchange({
        amount: 100,
        origin: 'USD',
        destination: 'EUR',
      });
      expect(result).toEqual({
        amount: 100,
        convertedAmount: 150,
        origin: 'USD',
        destination: 'EUR',
        exchangeRate: 1.5,
      });
    });
    it('should return error if exchange rate not found', async () => {
      jest.spyOn(exchangeService, 'getExchangeRate').mockReturnValue(null);
      const result = await controller.calculateExchange({
        amount: 100,
        origin: 'USD',
        destination: 'EUR',
      });
      expect(result).toEqual({ error: 'Exchange rate not found' });
    });
  });
  describe('updateExchangeRate', () => {
    it('should update exchange rate successfully', async () => {
      jest
        .spyOn(exchangeService, 'updateExchangeRate')
        .mockReturnValue(undefined);
      const result = await controller.updateExchangeRate({
        origin: 'USD',
        destination: 'EUR',
        rate: 1.5,
      });
      expect(result).toEqual({
        success: true,
        message: 'Exchange rate updated successfully',
      });
    });
    it('should handle error during updateExchangeRate', async () => {
      const errorMessage = 'Error updating exchange rate';
      jest
        .spyOn(exchangeService, 'updateExchangeRate')
        .mockImplementation(() => {
          throw new HttpException(
            {
              success: false,
              message: errorMessage,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
      try {
        await controller.updateExchangeRate({
          origin: 'USD',
          destination: 'EUR',
          rate: 1.5,
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getResponse()).toEqual({
          success: false,
          message: errorMessage,
        });
        expect(error.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
