import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableExchange1704948193266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exchange',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'origin', type: 'varchar', isNullable: false },
          { name: 'destination', type: 'varchar', isNullable: false },
          {
            name: 'rate',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    const exchangeRepository = queryRunner.connection.getRepository('exchange');

    const exchanges = exchangeRepository.create([
      { origin: 'USD', destination: 'EUR', rate: 0.92 },
      { origin: 'EUR', destination: 'USD', rate: 1.09 },
      { origin: 'PEN', destination: 'USD', rate: 3.7 },
      { origin: 'USD', destination: 'PEN', rate: 0.27 },
      { origin: 'PEN', destination: 'EUR', rate: 0.25 },
      { origin: 'EUR', destination: 'PEN', rate: 4.04 },
    ]);

    await exchangeRepository.save(exchanges);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exchange');
  }
}
