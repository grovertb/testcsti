import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1704915357329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    const userRepository = queryRunner.connection.getRepository('user');

    const users = userRepository.create([
      { username: 'csticorp', password: 'demo' },
      { username: 'user1', password: 'demo1' },
    ]);

    await userRepository.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
