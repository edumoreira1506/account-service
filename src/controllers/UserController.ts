import { Request, Response } from 'express'
import { ObjectType } from 'typeorm'
import BaseController from '@cig-platform/core/build/controllers/BaseController'

import i18n from '@Configs/i18n'
import UserBuilder from '@Builders/UserBuilder'
import User from '@Entities/UserEntity'
import UserRepository from '@Repositories/UserRepository'
import AuthService from '@Services/AuthService'

class UserController extends BaseController<User, UserRepository>  {
  constructor(repository: ObjectType<User>) {
    super(repository)

    this.store = this.store.bind(this)
    this.auth = this.auth.bind(this)
  }

  @BaseController.errorHandler()
  async store(req: Request, res: Response): Promise<Response> {
    const userDTO = await new UserBuilder(this.repository)
      .setName(req.body.name)
      .setPassword(req.body.password)
      .setEmail(req.body.email)
      .setBirthDate(req.body.birthDate)
      .setRegister(req.body.register)
      .build()

    const user = await this.repository.save(userDTO)

    return res.send({ message: i18n.__('messages.success'), user })
  }

  @BaseController.errorHandler()
  async auth(req: Request, res: Response): Promise<Response> {
    const email = req.body.email
    const password = req.body.password

    const token = await AuthService.login(email, password, this.repository)
    
    return res.send({ message: i18n.__('messages.success-login'),  token })
  }
}

export default new UserController(UserRepository)
