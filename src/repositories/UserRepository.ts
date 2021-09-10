import { EntityRepository, Repository } from 'typeorm'
import { FindEntityErrorHandler } from '@cig-platform/core'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import User from '@Entities/UserEntity'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  @FindEntityErrorHandler()
  findByField(fieldName: 'email' | 'register' | 'id', fieldValue: string) {
    return this.findOne({ [fieldName]: fieldValue, active: true })
  }

  @FindEntityErrorHandler()
  findByEmail(email: string) {
    return this.findByField('email', email)
  }

  @FindEntityErrorHandler()
  findByRegister(register: string) {
    return this.findByField('register', register)
  }

  @FindEntityErrorHandler()
  findById(id: string) {
    return this.findByField('id', id)
  }

  updateById(id: string, fields: QueryDeepPartialEntity<User>) {
    return this.update({ id }, fields)
  }
}
