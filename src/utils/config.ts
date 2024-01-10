export const authConfig = {
  jwtSecret: 'cst1c0rp',
  users: [
    {
      id: 1,
      user: 'csticorp',
      pass: 'demo',
    },
  ],
};

export const currencyExchangeDB = [
  { origin: 'USD', destination: 'EUR', rate: 0.92 },
  { origin: 'EUR', destination: 'USD', rate: 1.09 },
  { origin: 'PEN', destination: 'USD', rate: 3.7 },
  { origin: 'USD', destination: 'PEN', rate: 0.27 },
  { origin: 'PEN', destination: 'EUR', rate: 0.25 },
  { origin: 'EUR', destination: 'PEN', rate: 4.04 },
];
