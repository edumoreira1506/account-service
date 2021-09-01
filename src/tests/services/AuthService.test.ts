import i18n from '@Configs/i18n'
import AuthService from '@Services/AuthService'
import EncryptService from '@Services/EncryptService'
import TokenService from '@Services/TokenService'

import userFactory from '../factories/userFactory'

jest.mock('@Services/TokenService', () => ({
  default: {
    create: jest.fn(),
  }
}))

describe('AuthService', () => {
  describe('.login', () => {
    it('returns a token', async () => {
      const token = 'fake token'

      TokenService.create = jest.fn().mockResolvedValue(token)

      const user = userFactory()
      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.hash(user.password) })
      }

      expect(await AuthService.login(user.email, user.password, fakeUserRepository)).toBe(token)
    })

    it('trigger an error when email does not exist', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null)
      }

      await expect(AuthService.login(user.email, user.password, fakeUserRepository)).rejects.toThrow(i18n.__('auth.errors.invalid-login'))
    })

    it('trigger an error when password does not match', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.hash(user.password) })
      }

      await expect(AuthService.login(user.email, 'wrong password', fakeUserRepository)).rejects.toThrow(i18n.__('auth.errors.invalid-login'))
    })
  })
})
