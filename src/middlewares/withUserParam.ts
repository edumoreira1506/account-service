import { withRequestParam } from '@cig-platform/core'

import UserRepository from '@Repositories/UserRepository'
import User from '@Entities/UserEntity'

export default withRequestParam<User>('userId', 'user', UserRepository)
