import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ExchangeService } from './exchange.service';

interface ExchangeRequest {
  amount: number;
  origin: string;
  destination: string;
}

interface ExchangeUpdateRequest {
  origin: string;
  destination: string;
  rate: number;
}

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('calculate')
  calculateExchange(@Body() data: ExchangeRequest) {
    const { amount, origin, destination } = data;

    const exchangeRate = this.exchangeService.getExchangeRate(
      origin,
      destination,
    );

    if (!exchangeRate) {
      return { error: 'Exchange rate not found' };
    }

    return {
      amount,
      convertedAmount: amount * exchangeRate.rate,
      origin,
      destination,
      exchangeRate: exchangeRate.rate,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  updateExchangeRate(@Body() data: ExchangeUpdateRequest) {
    try {
      const { origin, destination, rate } = data;

      this.exchangeService.updateExchangeRate(origin, destination, rate);

      return {
        success: true,
        message: 'Exchange rate updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error updating exchange rate',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
