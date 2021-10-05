import { EntityRepository } from 'typeorm'
import { FindEntityErrorHandler, BaseRepository, FindEntitiesErrorHandler } from '@cig-platform/core'

import User from '@Entities/UserEntity'

@EntityRepository(User)
export default class UserRepository extends BaseRepository<User> {
  @FindEntitiesErrorHandler()
  search({ email }: { email?: string } = {}) {
    const filter = {
      ...(email ? ({ email }) : ({}))
    }
  
    return this.find(filter)
  }

  @FindEntityErrorHandler()
  findByEmail(email: string) {
    return this.findByField('email', email)
  }

  @FindEntityErrorHandler()
  findByRegister(register: string) {
    return this.findByField('register', register)
  }
}
