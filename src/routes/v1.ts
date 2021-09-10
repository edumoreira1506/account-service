import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import UserController from '@Controllers/UserController'
import { authUserSchema, storeUserSchema, updateUserSchema } from '@Schemas/UserSchemas'
import withUserParam from '@Middlewares/withUserParam'

const router = express.Router()

router.post('/auth', withBodyValidation(authUserSchema), UserController.auth)

router.post('/users', withBodyValidation(storeUserSchema), UserController.store)
router.patch('/users/:userId', withUserParam, withBodyValidation(updateUserSchema), UserController.update)
router.delete('/users/:userId', withUserParam, UserController.remove)

export default router
