
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @Column({ type: 'varchar', unique: false })
  name: string;

  @Column('varchar')
  register: string;

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: Date;

  @Column({ type: 'bool' })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
