import User from '@Entities/UserEntity'
import { BaseRepositoryFunctionsGenerator } from '@cig-platform/core'
import { dataSource } from '@Configs/database'

const BaseRepository = BaseRepositoryFunctionsGenerator<User>()

const UserRepository = dataSource.getRepository(User).extend({
  ...BaseRepository,

  search({ email }: { email?: string } = {}) {
    const filter = {
      ...(email ? ({ email }) : ({}))
    }
  
    return this.find({ where: filter })
  },

  findByField(field: string, value: string) {
    return this.findOne({
      where: {
        [field]: value
      }
    })
  },

  findByEmail(email: string) {
    return this.findByField('email', email)
  },

  findByRegister(register: string) {
    return this.findByField('register', register)
  }
})

export default UserRepository
