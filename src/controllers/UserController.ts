import { Request, Response } from 'express'
import { ObjectType } from 'typeorm'
import { ApiError, BaseController, NotFoundError } from '@cig-platform/core'

import { UserRequest } from '@Types/requests'
import i18n from '@Configs/i18n'
import UserBuilder from '@Builders/UserBuilder'
import User from '@Entities/UserEntity'
import UserRepository from '@Repositories/UserRepository'
import AuthService from '@Services/AuthService'
import EncryptService from '@Services/EncryptService'

class UserController extends BaseController<User, UserRepository>  {
  constructor(repository: ObjectType<User>) {
    super(repository)

    this.store = this.store.bind(this)
    this.auth = this.auth.bind(this)
    this.update = this.update.bind(this)
    this.remove = this.remove.bind(this)
    this.show = this.show.bind(this)
    this.index = this.index.bind(this)
    this.rollback = this.rollback.bind(this)
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

    return res.send({ ok: true, message: i18n.__('messages.success'), user })
  }

  @BaseController.errorHandler()
  @BaseController.actionHandler(i18n.__('messages.removed'))
  async rollback(req: UserRequest): Promise<void> {
    const user = req.user

    if (!user) throw new NotFoundError()

    const now = new Date()
    const userCreatedAt = user.createdAt
    const diffInMilliSeconds = Math.abs(now.getTime() - userCreatedAt.getTime())
    const diffInSeconds = diffInMilliSeconds / 1000

    if (diffInSeconds > 60) throw new ApiError(i18n.__('rollback.errors.expired'))

    await this.repository.delete({ id: user.id })
  }

  @BaseController.errorHandler()
  async auth(req: Request, res: Response): Promise<Response> {
    const email = req.body.email
    const password = req.body.password

    const user = await AuthService.login(email, password, this.repository)
    
    return BaseController.successResponse(res, { message: i18n.__('messages.success-login'), user })
  }

  @BaseController.errorHandler()
  @BaseController.actionHandler(i18n.__('messages.updated'))
  async update(req: UserRequest): Promise<void> {
    const user = req.user

    if (!user) throw new NotFoundError()

    const password = req.body?.password ?? EncryptService.decrypt(user.password)
    const newUser = { ...user, ...req.body, password }
    const userDTO = await new UserBuilder(this.repository)
      .setName(newUser.name)
      .setPassword(newUser.password)
      .setEmail(newUser.email)
      .setBirthDate(newUser.birthDate)
      .setRegister(newUser.register)
      .setId(user.id)
      .setActive(user.active)
      .build()

    await this.repository.update({ id: user.id }, userDTO)
  }

  @BaseController.errorHandler()
  @BaseController.actionHandler(i18n.__('messages.removed'))
  async remove(req: UserRequest): Promise<void> {
    const user = req.user

    if (!user) throw new NotFoundError()

    await this.repository.updateById(user.id, { active: false })
  }

  @BaseController.errorHandler()
  async show(req: UserRequest, res: Response): Promise<Response> {
    const user = req.user

    if (!user) throw new NotFoundError()

    return BaseController.successResponse(res, { user })
  }

  @BaseController.errorHandler()
  async index(req: Request, res: Response): Promise<Response> {
    const email = String(req.query?.email ?? '')

    const users = await this.repository.search({ email })

    return BaseController.successResponse(res, { users })
  }
}

export default new UserController(UserRepository)
