import { EntityRepository } from 'typeorm'
import { FindEntityErrorHandler, BaseRepository } from '@cig-platform/core'

import User from '@Entities/UserEntity'

@EntityRepository(User)
export default class UserRepository extends BaseRepository<User> {
  @FindEntityErrorHandler()
  findByEmail(email: string) {
    return this.findByField('email', email)
  }

  @FindEntityErrorHandler()
  findByRegister(register: string) {
    return this.findByField('register', register)
  }
}
