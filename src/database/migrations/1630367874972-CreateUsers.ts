import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUsers1630367874972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
          isNullable: false,
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'password',
          type: 'text',
          isNullable: false
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'register',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'birth_date',
          type: 'date',
          isNullable: true
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
