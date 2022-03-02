import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddExternalIdToUsers1646185179495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'external_id',
      type: 'uuid',
      isNullable: true,
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'external_id')
  }
}
