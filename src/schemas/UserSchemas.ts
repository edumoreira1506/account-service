import Joi from 'joi'

import i18n from '@Configs/i18n'
import { MAXIMUM_CHARACTERS_NAME, MAXIMUM_CHARACTERS_PASSWORD, MINIMUM_CHARACTERS_NAME, MINIMUM_CHARACTERS_PASSWORD, REGISTER_REGEX } from '@Constants/user'

export const storeUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': i18n.__('invalid-email', { field: i18n.__('user.fields.email') }),
    'string.empty': i18n.__('empty-field', { field: i18n.__('user.fields.email') }),
    'any.required': i18n.__('required-field', { field: i18n.__('user.fields.email') })
  }),
  password: Joi.string().required().min(MINIMUM_CHARACTERS_PASSWORD).max(MAXIMUM_CHARACTERS_PASSWORD).messages({
    'string.empty': i18n.__('empty-field', { field: i18n.__('user.fields.password') }),
    'any.required': i18n.__('required-field', { field: i18n.__('user.fields.password') })
  }),
  confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
    'any.only': i18n.__('must-be-equal', {
      field1: i18n.__('user.fields.password'),
      field2: i18n.__('user.fields.confirm-password').toLowerCase()
    }),
    'any.required': i18n.__('required-field', { field: i18n.__('user.fields.confirm-password') }),
    'string.empty': i18n.__('empty-field', { field: i18n.__('user.fields.confirm-password') }),
  }),
  name: Joi.string().required().min(MINIMUM_CHARACTERS_NAME).max(MAXIMUM_CHARACTERS_NAME).messages({
    'string.empty': i18n.__('empty-field', { field: i18n.__('user.fields.name') }),
    'any.required': i18n.__('required-field', { field: i18n.__('user.fields.name') })
  }),
  register: Joi.string().regex(REGISTER_REGEX).messages({
    'string.pattern.base': i18n.__('user.errors.invalid-register')
  }),
  birthDate: Joi.date().messages({
    'date.base': i18n.__('invalid-date', { field: i18n.__('user.fields.birth-date') })
  }),
}).options({ abortEarly: false })
