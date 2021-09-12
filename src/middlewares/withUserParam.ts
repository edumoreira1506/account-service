import { withRequestParam } from '@cig-platform/core'

import UserController from '@Controllers/UserController'
import UserRepository from '@Repositories/UserRepository'
import User from '@Entities/UserEntity'

export default withRequestParam<UserRepository, User>('userId', 'user', UserController)
