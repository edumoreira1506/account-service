import { AuthError } from '@cig-platform/core'
import { UserRegisterTypeEnum } from '@cig-platform/enums'

import UserRepository from '@Repositories/UserRepository'
import EncryptService from '@Services/EncryptService'

export default class AuthService {
  static async login({
    email,
    password = '',
    externalId,
    type = UserRegisterTypeEnum.Default
  }: {
    email: string;
    password?: string;
    type?: string;
    externalId?: string;
  }, userRepository: typeof UserRepository) {
    const user = await userRepository.findByEmail(email)

    if (!user) throw new AuthError()

    const isDefaultRegister = type === UserRegisterTypeEnum.Default
    const isValidLogin = isDefaultRegister
      ? EncryptService.check(password, user.password)
      : user.externalId === externalId

    if (!isValidLogin) throw new AuthError()
  
    return user
  }
}
