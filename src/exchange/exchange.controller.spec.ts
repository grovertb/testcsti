import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let exchangeService: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    it('should return converted amount if exchange rate found', () => {
      jest.spyOn(exchangeService, 'getExchangeRate').mockReturnValue({
        origin: 'USD',
        destination: 'EUR',
        rate: 1.5,
      });

      const result = controller.calculateExchange({
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

    it('should return error if exchange rate not found', () => {
      jest.spyOn(exchangeService, 'getExchangeRate').mockReturnValue(null);

      const result = controller.calculateExchange({
        amount: 100,
        origin: 'USD',
        destination: 'EUR',
      });

      expect(result).toEqual({ error: 'Exchange rate not found' });
    });
  });

  describe('updateExchangeRate', () => {
    it('should update exchange rate successfully', () => {
      jest
        .spyOn(exchangeService, 'updateExchangeRate')
        .mockReturnValue(undefined);

      const result = controller.updateExchangeRate({
        origin: 'USD',
        destination: 'EUR',
        rate: 1.5,
      });

      expect(result).toEqual({
        success: true,
        message: 'Exchange rate updated successfully',
      });
    });

    it('should handle error during updateExchangeRate', () => {
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
        controller.updateExchangeRate({
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
