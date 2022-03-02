import { userFactory } from '@cig-platform/factories'

import i18n from '@Configs/i18n'
import AuthService from '@Services/AuthService'
import EncryptService from '@Services/EncryptService'

describe('AuthService', () => {
  describe('.login', () => {
    it('returns an user', async () => {
      const user = userFactory()
      const mockEncryptPassword = jest.fn().mockReturnValue(user.password)
      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue({ ...user })
      }

      jest.spyOn(EncryptService, 'encrypt').mockImplementation(mockEncryptPassword)
      jest.spyOn(EncryptService, 'decrypt').mockImplementation(mockEncryptPassword)

      expect(await AuthService.login({
        email: user.email,
        password: user.password
      }, fakeUserRepository)).toMatchObject(user)
    })

    it('trigger an error when email does not exist', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null)
      }

      await expect(AuthService.login({
        email: user.email,
        password: user.password
      }, fakeUserRepository)).rejects.toThrow(i18n.__('auth.errors.invalid-login'))
    })

    it('trigger an error when password does not match', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.encrypt(user.password) })
      }

      await expect(AuthService.login({
        email: user.email,
        password: 'wrong password'
      }, fakeUserRepository)).rejects.toThrow(i18n.__('auth.errors.invalid-login'))
    })
  })
})
