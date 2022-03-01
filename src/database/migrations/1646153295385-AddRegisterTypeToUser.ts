import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddRegisterTypeToUser1646153295385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'register_type',
      type: 'varchar',
      isNullable: true,
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'register_type')
  }
}
