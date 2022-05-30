import request from 'supertest'
import typeorm from 'typeorm'
import faker from '@faker-js/faker'
import { userFactory } from '@cig-platform/factories'

import App from '@Configs/server'
import i18n from '@Configs/i18n'
import EncryptService from '@Services/EncryptService'

import UserController, { removeUserPrivateFields } from '@Controllers/UserController'
import { UserRegisterTypeEnum } from '@cig-platform/enums'
import { EXTERNAL_REGISTER_TYPES } from '@Builders/UserBuilder'

jest.mock('typeorm', () => ({
  createConnection: jest.fn().mockResolvedValue({}),
  Column: jest.fn(),
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  CreateDateColumn: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: jest.fn(),
  getCustomRepository: jest.fn().mockReturnValue({
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    findByRegister: jest.fn().mockResolvedValue(null),
    save: jest.fn()
  }),
}))

describe('User actions', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  describe('Register', () => {
    it('is a valid user', async () => {
      const mockSave = jest.fn()
      const user = userFactory()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        save: mockSave,
        findByEmail: jest.fn().mockResolvedValue(null),
        findById: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(null),
      })

      const response = await request(App).post('/v1/users').send({
        name: user.name,
        password: user.password,
        email: user.email,
        register: user.register,
        birthDate: user.birthDate,
        confirmPassword: user.confirmPassword
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        message: i18n.__('messages.success'),
        ok: true,
      })
      expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
        name: user.name,
        email: user.email,
        register: user.register,
      }))
    })

    it('is a invalid user when has no email', async () => {
      const user = userFactory()
      const response = await request(App).post('/v1/users').send({
        name: user.name,
        password: user.password,
        register: user.register,
        birthDate: user.birthDate,
        confirmPassword: user.confirmPassword
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('required-field', { field: i18n.__('user.fields.email') })
        }
      })
    })

    it('is a invalid user when has no name', async () => {
      const user = userFactory()
      const response = await request(App).post('/v1/users').send({
        register: user.register,
        birthDate: user.birthDate,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('required-field', { field: i18n.__('user.fields.name') })
        }
      })
    })

    it('is a invalid user when is an invalid register', async () => {
      const user = userFactory()
      const response = await request(App).post('/v1/users').send({
        name: user.name,
        register: 'invalid register',
        birthDate: user.birthDate,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('user.errors.invalid-register')
        }
      })
    })

    it('is a invalid user when is an invalid birth date', async () => {
      const user = userFactory()
      const response = await request(App).post('/v1/users').send({
        name: user.name,
        register: user.register,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
        birthDate: 'invalid birth date'
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message:  i18n.__('invalid-date', { field: i18n.__('user.fields.birth-date') })
        }
      })
    })

    EXTERNAL_REGISTER_TYPES.forEach(registerType => {
      it(`is a valid user when has no password and register type is ${registerType}`, async () => {
        const mockSave = jest.fn()
        const user = userFactory()
  
        jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
          save: mockSave,
          findByEmail: jest.fn().mockResolvedValue(null),
          findById: jest.fn().mockResolvedValue(null),
          findByRegister: jest.fn().mockResolvedValue(null),
        })
  
        const response = await request(App).post('/v1/users').send({
          name: user.name,
          email: user.email,
          register: user.register,
          birthDate: user.birthDate,
          registerType: UserRegisterTypeEnum.Facebook,
          externalId: user.externalId
        })
  
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
          message: i18n.__('messages.success'),
          ok: true,
        })
        expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
          name: user.name,
          email: user.email,
          register: user.register,
          registerType: UserRegisterTypeEnum.Facebook,
          externalId: user.externalId
        }))
      })
    })

    describe('default register type', () => {
      it('is a invalid user when has no password and', async () => {
        const user = userFactory({ registerType: UserRegisterTypeEnum.Default })
        const response = await request(App).post('/v1/users').send({
          name: user.name,
          register: user.register,
          birthDate: user.birthDate,
          email: user.email,
          registerType: user.registerType
        })
  
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({
          ok: false,
          error: {
            name: 'ValidationError',
            message: i18n.__('user.errors.invalid-password')
          }
        })
      })
  
      it('is a invalid user when password is different from the password', async () => {
        const user = userFactory()
        const response = await request(App).post('/v1/users').send({
          name: user.name,
          register: user.register,
          password: 'one',
          confirmPassword: 'another',
          birthDate: user.birthDate,
          email: user.email,
        })
  
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({
          ok: false,
          error: {
            name: 'ValidationError',
            message: i18n.__('must-be-equal', {
              field1: i18n.__('user.fields.password'),
              field2: i18n.__('user.fields.confirm-password').toLowerCase()
            })
          }
        })
      })
    })
  })

  describe('Rollback', () => {
    it('returns OK when user exists and the rollback time is not expired yet', async () => {
      const user = { ...userFactory(), createdAt: new Date() }
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).post(`/v1/users/${user.id}/rollback`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        message: i18n.__('messages.removed')
      })
      expect(fakeUserRepository.delete).toHaveBeenCalledWith({ id: user.id })
      expect(fakeUserRepository.findById).toHaveBeenCalledWith(user.id)
    })

    it('returns not found error when user does not exist', async () => {
      const user = null
      const userId = faker.datatype.uuid()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).post(`/v1/users/${userId}/rollback`)

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'NotFoundError',
          message: i18n.__('errors.not-found')
        }
      })
      expect(fakeUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(fakeUserRepository.delete).not.toHaveBeenCalled()
    })

    it('returns expired error when the time to rollback user is expired', async () => {
      const second = 1000
      const minute = 60 * second
      const nowDate = new Date()
      const oneHourAgoDate = new Date(nowDate.getTime() - (60 * minute))
      const user = { ...userFactory(), createdAt: oneHourAgoDate }
      const userId = faker.datatype.uuid()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).post(`/v1/users/${userId}/rollback`)

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'Error',
          message: i18n.__('rollback.errors.expired')
        }
      })
      expect(fakeUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(fakeUserRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('Authentication', () => {
    it('is invalid user credentials when email does not exist', async () => {
      const user = userFactory()

      const fakeUserRepository: any = {
        findByEmail: jest.fn().mockResolvedValue(null),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).post('/v1/auth').send({
        email: user.email,
        password: user.password
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'AuthError',
          message: i18n.__('auth.errors.invalid-login')
        }
      })
    })

    describe('default register type', () => {
      it('is valid user credentials', async () => {
        const user = userFactory()
  
        const fakeUserRepository: any = {
          findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.encrypt(user.password) }),
        }
  
        jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

        const response = await request(App).post('/v1/auth').send({
          email: user.email,
          password: user.password
        })
  
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
          ok: true,
          message: i18n.__('messages.success-login'),
        })
      })

      it('is invalid user credentials when password does not match', async () => {
        const user = userFactory()
  
        const fakeUserRepository: any = {
          findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.encrypt(user.password) }),
        }
  
        jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

        const response = await request(App).post('/v1/auth').send({
          email: user.email,
          password: 'wrong password'
        })
  
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({
          ok: false,
          error: {
            name: 'AuthError',
            message: i18n.__('auth.errors.invalid-login')
          }
        })
      })
    })

    EXTERNAL_REGISTER_TYPES.forEach(registerType => {
      describe(`${registerType} register type`, () => {
        it('is valid user credentials ', async () => {
          const user = userFactory({ registerType })
    
          const fakeUserRepository: any = {
            findByEmail: jest.fn().mockResolvedValue({
              ...user,
              externalId: user.externalId
            }),
          }
    
          jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

          const response = await request(App).post('/v1/auth').send({
            email: user.email,
            type: registerType,
            externalId: user.externalId
          })
    
          expect(response.statusCode).toBe(200)
          expect(response.body).toMatchObject({
            ok: true,
            message: i18n.__('messages.success-login'),
          })
        })

        it('is an invalid user credentials when external id does not match ', async () => {
          const externalId = faker.datatype.uuid()
          const user = userFactory({ registerType })
    
          const fakeUserRepository: any = {
            findByEmail: jest.fn().mockResolvedValue({
              ...user,
              externalId: user.externalId
            }),
          }
    
          jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

          const response = await request(App).post('/v1/auth').send({
            email: user.email,
            type: registerType,
            externalId
          })
    
          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            ok: false,
            error: {
              name: 'AuthError',
              message: i18n.__('auth.errors.invalid-login')
            }
          })
        })
      })
    })
  })

  describe('Update', () => {
    it('is a valid user update', async () => {
      const mockUpdate = jest.fn()
      const user = userFactory({
        password: EncryptService.encrypt('password')
      })
      const newUserInfo = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: mockUpdate,
      }

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue(fakeUserRepository)
      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        name: newUserInfo.name,
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        message: i18n.__('messages.updated'),
        ok: true,
      })
      expect(mockUpdate).toHaveBeenCalledWith({ id: user.id }, expect.objectContaining({
        name: newUserInfo.name,
      }))
    })

    it('keeps the old password and does not send password', async () => {
      const password = 'password'
      const mockUpdate = jest.fn()
      const user = { ...userFactory(), password: EncryptService.encrypt(password) }
      const newUserInfo = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: mockUpdate,
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)
      jest.spyOn(EncryptService, 'encrypt').mockReturnValue(password)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        name: newUserInfo.name,
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        message: i18n.__('messages.updated'),
        ok: true,
      })
      expect(mockUpdate).toHaveBeenCalledWith({ id: user.id }, expect.objectContaining({
        password,
      }))
    })

    it('updates the password', async () => {
      const password = 'password'
      const encryptedPassword = 'encrypted password'
      const mockUpdate = jest.fn()
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: mockUpdate,
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)
      jest.spyOn(EncryptService, 'encrypt').mockReturnValue(encryptedPassword)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        password,
        confirmPassword: password
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        message: i18n.__('messages.updated'),
        ok: true,
      })
      expect(mockUpdate).toHaveBeenCalledWith({ id: user.id }, expect.objectContaining({
        password: encryptedPassword,
      }))
    })

    it('is a invalid user when is an invalid email', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        email: 'wrong email'
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('invalid-email', { field: i18n.__('user.fields.email') })
        }
      })
    })

    it('is a invalid user when password is different from the password', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        password: 'one',
        confirmPassword: 'another',
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('must-be-equal', {
            field1: i18n.__('user.fields.password'),
            field2: i18n.__('user.fields.confirm-password').toLowerCase()
          })
        }
      })
    })

    it('is a invalid user when is an invalid register', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        register: 'invalid register',
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('user.errors.invalid-register')
        }
      })
    })

    it('is a invalid user when is an invalid birth date', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).patch(`/v1/users/${user.id}`).send({
        birthDate: 'invalid birth date'
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('invalid-date', { field: i18n.__('user.fields.birth-date') })
        }
      })
    })
  })

  describe('Remove', () => {
    it('returns an error when user does not exist', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(null),
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(null),
        save: jest.fn(),
        update: jest.fn(),
        updateById: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).delete(`/v1/users/${user.id}`)

      expect(fakeUserRepository.updateById).not.toHaveBeenCalled()
      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          message: i18n.__('errors.not-found'),
          name: 'NotFoundError'
        }
      })
    })

    it('updates the active field', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: jest.fn(),
        updateById: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).delete(`/v1/users/${user.id}`)

      expect(fakeUserRepository.updateById).toHaveBeenCalledWith(user.id, { active: false })
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        message: i18n.__('messages.removed')
      })
    })
  })

  describe('Get', () => {
    it('returns an error when user does not exist', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(null),
        findByEmail: jest.fn().mockResolvedValue(null),
        findByRegister: jest.fn().mockResolvedValue(null),
        save: jest.fn(),
        update: jest.fn(),
        updateById: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).get(`/v1/users/${user.id}`)

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          message: i18n.__('errors.not-found'),
          name: 'NotFoundError'
        }
      })
    })

    it('returns the user when is valid', async () => {
      const user = userFactory()
      const fakeUserRepository: any = {
        findById: jest.fn().mockResolvedValue(user),
        findByEmail: jest.fn().mockResolvedValue(user),
        findByRegister: jest.fn().mockResolvedValue(user),
        save: jest.fn(),
        update: jest.fn(),
        updateById: jest.fn(),
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).get(`/v1/users/${user.id}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        user: {
          ...removeUserPrivateFields(user),
          birthDate: user.birthDate?.toISOString()
        },
      })
    })
  })

  describe('Search', () => {
    it('returns the users', async () => {
      const users = Array(10).fill(null).map(() => userFactory())
      const fakeUserRepository: any = {
        search: jest.fn().mockResolvedValue(users)
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      const response = await request(App).get('/v1/users')

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        users: users.map((user) => ({
          ...removeUserPrivateFields(user),
          birthDate: user.birthDate.toISOString()
        }))
      })
    })

    it('searches using the email sent as query param', async () => {
      const users = Array(10).fill(null).map(() => userFactory())
      const email = faker.internet.email()
      const fakeUserRepository: any = {
        search: jest.fn().mockResolvedValue(users)
      }

      jest.spyOn(UserController, 'repository', 'get').mockReturnValue(fakeUserRepository)

      await request(App).get(`/v1/users?email=${email}`)

      expect(fakeUserRepository.search).toHaveBeenCalledWith({ email })
    })
  })
})
