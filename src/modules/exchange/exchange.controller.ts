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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';

class ExchangeRequest {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;
  @ApiProperty()
  @IsNotEmpty()
  origin: string;
  @ApiProperty()
  @IsNotEmpty()
  destination: string;
}

class ExchangeUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  origin: string;
  @ApiProperty()
  @IsNotEmpty()
  destination: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  rate: number;
}

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @ApiOperation({
    summary: 'Calcular intercambio',
  })
  @ApiBody({ type: ExchangeRequest, required: true })
  @ApiBearerAuth()
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
