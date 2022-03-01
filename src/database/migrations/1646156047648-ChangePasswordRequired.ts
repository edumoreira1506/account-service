import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ChangePasswordRequired1646156047648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('users', 'password', new TableColumn({
      name: 'password',
      type: 'text',
      isNullable: true
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('users', 'password', new TableColumn({
      name: 'password',
      type: 'text',
      isNullable: false
    }))
  }
}
