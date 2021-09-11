import { ApiError } from '@cig-platform/core'

import i18n from '@Configs/i18n'

export default class AuthError extends ApiError {
  constructor() {
    super(i18n.__('auth.errors.invalid-login'))

    this.name = 'AuthError'
  }
}
