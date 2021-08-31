import { EntityRepository, Repository } from 'typeorm'

import User from '@Entities/UserEntity'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email })
  }

  findByRegister(register: string): Promise<User | undefined> {
    return this.findOne({ register })
  }
}
