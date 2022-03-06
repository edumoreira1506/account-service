import { userFactory } from '@cig-platform/factories'

import UserBuilder, { EXTERNAL_REGISTER_TYPES } from '@Builders/UserBuilder'
import i18n from '@Configs/i18n'

describe('UserBuilder', () => {
  describe('.build', () => {
    it('a valid user', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(null)
      }
      const userBuilder = new UserBuilder(fakeRepository)
        .setName(user.name)
        .setPassword(user.password)
        .setEmail(user.email)
        .setRegister(user.register)

      expect(await userBuilder.build()).toMatchObject({
        name: user.name,
        email: user.email,
        register: user.register
      })
    })

    it('an invalid user when is default register type and has no password', async () => {
      const password = ''
      const user = userFactory({ password, confirmPassword: password })
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(null)
      }
      const userBuilder = new UserBuilder(fakeRepository)
        .setName(user.name)
        .setPassword(user.password)
        .setEmail(user.email)
        .setRegister(user.register)

      await expect(userBuilder.build).rejects.toThrow(i18n.__('user.errors.invalid-password'))
    })

    EXTERNAL_REGISTER_TYPES.forEach(registerType => {
      it(`an invalid user when is register type ${registerType} and has no external id`, async () => {
        const externalId = ''
        const user = userFactory({ externalId, registerType })
        const fakeRepository: any = {
          findByEmail: jest.fn().mockResolvedValue(null),
          findByRegister: jest.fn().mockResolvedValue(null)
        }
        const userBuilder = new UserBuilder(fakeRepository)
          .setName(user.name)
          .setPassword(user.password)
          .setEmail(user.email)
          .setRegister(user.register)
          .setRegisterType(user.registerType)
  
        await expect(userBuilder.build).rejects.toThrow(i18n.__('user.errors.invalid-external-id'))
      })
    })

    it('an invalid user when is a duplicated email', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(null)
      }
      const userBuilder = new UserBuilder(fakeRepository).setEmail(user.email).setPassword(user.password)

      await expect(userBuilder.build).rejects.toThrow(i18n.__('user.errors.duplicated-email'))
    })

    it('an invalid user when is a duplicated register', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(user)
      }
      const userBuilder = new UserBuilder(fakeRepository).setRegister(user.register).setPassword(user.password)

      await expect(userBuilder.build).rejects.toThrow(i18n.__('user.errors.duplicated-register'))
    })

    it('a valid user when is the same user returned by findByEmail', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(null)
      }
      const userBuilder = new UserBuilder(fakeRepository)
        .setName(user.name)
        .setPassword(user.password)
        .setEmail(user.email)
        .setRegister(user.register)
        .setId(user.id)

      expect(await userBuilder.build()).toMatchObject({
        name: user.name,
        email: user.email,
        register: user.register
      })
    })

    it('a valid user when is the same user returned by findByRegister', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(user)
      }
      const userBuilder = new UserBuilder(fakeRepository)
        .setName(user.name)
        .setPassword(user.password)
        .setEmail(user.email)
        .setRegister(user.register)
        .setId(user.id)

      expect(await userBuilder.build()).toMatchObject({
        name: user.name,
        email: user.email,
        register: user.register
      })
    })
  })
})
