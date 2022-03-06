import { EntityRepository } from 'typeorm'
import { BaseRepository } from '@cig-platform/core'
import { ErrorHandler } from '@cig-platform/decorators'

import User from '@Entities/UserEntity'

@EntityRepository(User)
export default class UserRepository extends BaseRepository<User> {
  @ErrorHandler([])
  search({ email }: { email?: string } = {}) {
    const filter = {
      ...(email ? ({ email }) : ({}))
    }
  
    return this.find(filter)
  }

  @ErrorHandler()
  findByEmail(email: string) {
    return this.findByField('email', email)
  }

  @ErrorHandler()
  findByRegister(register: string) {
    return this.findByField('register', register)
  }
}
