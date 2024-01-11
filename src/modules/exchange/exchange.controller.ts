import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ExchangeService } from './exchange.service';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

class ExchangeRequest {
  @IsNumber()
  @Min(1)
  amount: number;
  @IsNotEmpty()
  origin: string;
  @IsNotEmpty()
  destination: string;
}

class ExchangeUpdateRequest {
  @IsNotEmpty()
  origin: string;
  @IsNotEmpty()
  destination: string;
  @IsNumber()
  @Min(0)
  rate: number;
}

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('calculate')
  async calculateExchange(@Body(new ValidationPipe()) data: ExchangeRequest) {
    const { amount, origin, destination } = data;

    const exchangeRate = await this.exchangeService.getExchangeRate(
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
  async updateExchangeRate(
    @Body(new ValidationPipe()) data: ExchangeUpdateRequest,
  ) {
    try {
      const { origin, destination, rate } = data;

      await this.exchangeService.updateExchangeRate(origin, destination, rate);

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
