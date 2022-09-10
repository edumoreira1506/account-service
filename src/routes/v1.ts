import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import UserController from '@Controllers/UserController'
import { authUserSchema, storeUserSchema, updateUserSchema } from '@Schemas/UserSchemas'
import withUserParam from '@Middlewares/withUserParam'
import withApiKey from '@Middlewares/withApiKey'

const router = express.Router()

router.post('/auth', withApiKey, withBodyValidation(authUserSchema), UserController.auth)

router.post('/users', withApiKey, withBodyValidation(storeUserSchema), UserController.store)
router.get('/users', withApiKey, UserController.index)
router.patch('/users/:userId', withApiKey, withUserParam, withBodyValidation(updateUserSchema), UserController.update)
router.delete('/users/:userId', withApiKey, withUserParam, UserController.remove)
router.get('/users/:userId', withApiKey, withUserParam, UserController.show)
router.post('/users/:userId/rollback', withApiKey, withUserParam, UserController.rollback)

export default router
