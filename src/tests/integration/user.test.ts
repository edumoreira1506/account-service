import request from 'supertest'
import typeorm from 'typeorm'

import App from '@Configs/server'
import i18n from '@Configs/i18n'

import userFactory from '../factories/userFactory'
import EncryptService from '@Services/EncryptService'

jest.mock('typeorm', () => ({
  createConnection: jest.fn().mockResolvedValue({}),
  Column: jest.fn(),
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: jest.fn(),
  getCustomRepository: jest.fn().mockReturnValue({
    findByEmail: jest.fn().mockResolvedValue(null),
    findByRegister: jest.fn().mockResolvedValue(null),
    save: jest.fn()
  }),
}))

describe('User actions', () => {
  describe('Register', () => {
    it('is a valid user', async () => {
      const user = userFactory()
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
          message: 'E-mail é obrigatório'
        }
      })
    })

    it('is a invalid user when has no password', async () => {
      const user = userFactory()
      const response = await request(App).post('/v1/users').send({
        name: user.name,
        register: user.register,
        birthDate: user.birthDate,
        email: user.email,
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: 'Senha é obrigatório. Confirmação de senha é obrigatório'
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
          message: 'Senha precisa ser igual ao confirmação de senha'
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
          message: 'Nome é obrigatório'
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
          message: 'Formato do CPF inválido'
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
          message: 'Data de nascimento precisa ser uma data'
        }
      })
    })
  })

  describe('Authentication', () => {
    it('is valid user credentials', async () => {
      const user = userFactory()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.encrypt(user.password) }),
      })

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

    it('is invalid user credentials when email does not exist', async () => {
      const user = userFactory()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findByEmail: jest.fn().mockResolvedValue(null),
      })

      const response = await request(App).post('/v1/auth').send({
        email: user.email,
        password: user.password
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'AuthError',
          message: 'E-mail ou senha inválido'
        }
      })
    })

    it('is invalid user credentials when password does not match', async () => {
      const user = userFactory()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findByEmail: jest.fn().mockResolvedValue({ ...user, password: EncryptService.encrypt(user.password) }),
      })

      const response = await request(App).post('/v1/auth').send({
        email: user.email,
        password: 'wrong password'
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'AuthError',
          message: 'E-mail ou senha inválido'
        }
      })
    })
  })
})
