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
  private _birthDate: Date;
  private _repository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._repository = userRepository
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

  async validate(): Promise<void> {
    const userOfEmail = await this._repository.findByEmail(this._email)
    const isDuplicatedEmail = Boolean(userOfEmail)

    if (isDuplicatedEmail) throw new ValidationError(i18n.__('user.errors.duplicated-email'))

    const userOfRegister = await this._repository.findByRegister(this._register)
    const isDuplicatedRegister = Boolean(userOfRegister)

    if (isDuplicatedRegister) throw new ValidationError(i18n.__('user.errors.duplicated-register'))
  }

  encryptPassword(): void {
    this._password = EncryptService.hash(this._password)
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

    return user
  }
}
