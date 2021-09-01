import { EntityRepository, Repository } from 'typeorm'
import { FindEntityErrorHandler } from '@cig-platform/core'

import User from '@Entities/UserEntity'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  @FindEntityErrorHandler()
  findByEmail(email: string) {
    return this.findOne({ email })
  }

  @FindEntityErrorHandler()
  findByRegister(register: string) {
    return this.findOne({ register })
  }

  @FindEntityErrorHandler()
  findById(id: string) {
    return this.findOne({ id })
  }
}
