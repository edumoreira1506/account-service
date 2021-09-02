import ApiError from '@cig-platform/core/build/errors/ApiError'

import i18n from '@Configs/i18n'

export default class NotFoundError extends ApiError {
  constructor() {
    super(i18n.__('errors.not-found'))

    this.name = 'NotFoundError'
  }
}
