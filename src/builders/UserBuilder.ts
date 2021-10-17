import { ValidationError } from '@cig-platform/core'

import i18n from '@Configs/i18n'
import User from '@Entities/UserEntity'
import UserRepository from '@Repositories/UserRepository'
import EncryptService from '@Services/EncryptService'

export default class UserBuilder {
  private _name = '';
  private _email = '';
  private _password = '';
  private _register = '';
  private _id: undefined | string = undefined;
  private _birthDate: Date;
  private _repository: UserRepository;
  private _active = true;

  constructor(userRepository: UserRepository) {
    this._repository = userRepository
  }

  setActive(active: boolean): UserBuilder {
    this._active = active

    return this
  }

  setId(id: string): UserBuilder {
    this._id = id

    return this
  }

  setRegister(register: string): UserBuilder {
    this._register = register

    return this
  }

  setBirthDate(birthDate: Date): UserBuilder {
    this._birthDate = birthDate

    return this
  }

  setEmail(email: string): UserBuilder {
    this._email = email

    return this
  }

  setName(name: string): UserBuilder {
    this._name = name

    return this
  }

  setPassword(password: string): UserBuilder {
    this._password = password

    return this
  }

  validate = async(): Promise<void> => {
    const userOfEmail = await this._repository.findByEmail(this._email)
    const isDuplicatedEmail = Boolean(userOfEmail) && userOfEmail?.id !== this._id

    if (isDuplicatedEmail) throw new ValidationError(i18n.__('user.errors.duplicated-email'))

    const userOfRegister = await this._repository.findByRegister(this._register)
    const isDuplicatedRegister = Boolean(userOfRegister) && userOfRegister?.id !== this._id

    if (isDuplicatedRegister) throw new ValidationError(i18n.__('user.errors.duplicated-register'))
  }

  encryptPassword = (): void => {
    this._password = EncryptService.encrypt(this._password)
  }

  build = async (): Promise<User> => {
    await this.validate()

    this.encryptPassword()

    const user = new User()

    user.name = this._name
    user.email = this._email
    user.password = this._password
    user.birthDate = this._birthDate
    user.register = this._register
    user.active = this._active

    if (this._id) {
      user.id = this._id
    }

    return user
  }
}
