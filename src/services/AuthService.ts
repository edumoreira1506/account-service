import { AuthError } from '@cig-platform/core'

import UserRepository from '@Repositories/UserRepository'
import EncryptService from '@Services/EncryptService'

export default class AuthService {
  static async login(email: string, password: string, userRepository: UserRepository) {
    const user = await userRepository.findByEmail(email)

    if (!user) throw new AuthError()

    const isValidPassword = EncryptService.check(password, user.password)

    if (!isValidPassword) throw new AuthError()

    return user
  }
}
