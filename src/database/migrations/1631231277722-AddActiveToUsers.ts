import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddActiveToUsers1631231277722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'active',
      type: 'boolean',
      default: true
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'active')
  }
}
