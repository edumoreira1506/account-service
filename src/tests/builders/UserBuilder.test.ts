import { userFactory } from '@cig-platform/core'

import UserBuilder from '@Builders/UserBuilder'
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

    it('a invalid user when is a duplicated email', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(null)
      }
      const userBuilder = new UserBuilder(fakeRepository)

      await expect(userBuilder.build).rejects.toThrow(i18n.__('user.errors.duplicated-email'))
    })

    it('a invalid user when is a duplicated register', async () => {
      const user = userFactory()
      const fakeRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(user)
      }
      const userBuilder = new UserBuilder(fakeRepository)

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
