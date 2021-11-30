import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import UserController from '@Controllers/UserController'
import { authUserSchema, storeUserSchema, updateUserSchema } from '@Schemas/UserSchemas'
import withUserParam from '@Middlewares/withUserParam'

const router = express.Router()

router.post('/auth', withBodyValidation(authUserSchema), UserController.auth)

router.post('/users', withBodyValidation(storeUserSchema), UserController.store)
router.get('/users', UserController.index)
router.patch('/users/:userId', withUserParam, withBodyValidation(updateUserSchema), UserController.update)
router.delete('/users/:userId', withUserParam, UserController.remove)
router.get('/users/:userId', withUserParam, UserController.show)
router.post('/users/:userId/rollback', withUserParam, UserController.rollback)

export default router
