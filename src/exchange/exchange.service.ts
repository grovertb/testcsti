import { Injectable } from '@nestjs/common';
import { currencyExchangeDB } from '../utils/config';

@Injectable()
export class ExchangeService {
  getExchangeRate(origin: string, destination: string) {
    return currencyExchangeDB.find(
      (entry) => entry.origin === origin && entry.destination === destination,
    );
  }

  updateExchangeRate(origin: string, destination: string, rate: number) {
    const existingIndex = currencyExchangeDB.findIndex(
      (entry) => entry.origin === origin && entry.destination === destination,
    );

    if (existingIndex === -1) {
      throw new Error('Error updating exchange rate');
    }

    currencyExchangeDB[existingIndex].rate = rate;
  }
}
