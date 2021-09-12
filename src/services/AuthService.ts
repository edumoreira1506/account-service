import { AuthError } from '@cig-platform/core'

import UserRepository from '@Repositories/UserRepository'
import EncryptService from '@Services/EncryptService'
import TokenService from '@Services/TokenService'

export default class AuthService {
  static async login(email: string, password: string, userRepository: UserRepository): Promise<string> {
    const user = await userRepository.findByEmail(email)

    if (!user) throw new AuthError()

    const isValidPassword = EncryptService.check(password, user.password)

    if (!isValidPassword) throw new AuthError()

    const token = TokenService.create(user.email, user.id, user.name)

    return token
  }
}
