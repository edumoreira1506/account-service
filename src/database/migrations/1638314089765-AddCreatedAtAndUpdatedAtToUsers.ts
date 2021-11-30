import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddCreatedAtToUsers1638314089765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP(6)'
    }))
  }
    
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'created_at')
  }
}
