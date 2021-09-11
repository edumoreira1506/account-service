import { NextFunction, Response } from 'express'
import { ApiError, BaseController, NotFoundError } from '@cig-platform/core'

import { UserRequest } from '@Types/requests'
import UserController from '@Controllers/UserController'
import UserRepository from '@Repositories/UserRepository'

export const withUserParamFactory = (errorCallback: (res: Response, error: ApiError) => Response, repository?: UserRepository) => {
  return async (request: UserRequest, response: Response, next: NextFunction): Promise<void | Response<string, Record<string, string>>> => {
    const userId = request?.params?.userId

    const userRepository = repository ?? UserController.repository

    return userRepository.findById(userId)
      .then(user => {
        if (!user) throw new NotFoundError()

        request.user = user

        next()
      })
      .catch((error) => errorCallback(response, error?.getError?.() ?? error))
  }
}

export default withUserParamFactory(BaseController.errorResponse)
