import { Request } from 'express'

import User from '@Entities/UserEntity'

export interface UserRequest extends Request {
  user?: User;
}
