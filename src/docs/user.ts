import { createDoc } from '@cig-platform/docs'
import { authUserSchema, storeUserSchema, updateUserSchema } from '@Schemas/UserSchemas'

const userDocs = {
  ...createDoc('/auth', ['Users'], [
    {
      method: 'post',
      title: 'Auth user',
      objectSchema: authUserSchema
    }
  ]),
  ...createDoc('/users', ['Users'], [
    {
      method: 'post',
      title: 'Create user',
      objectSchema: storeUserSchema
    },
  ]),
  ...createDoc('/users/{userId}', ['Users'], [
    {
      method: 'patch',
      title: 'Update user',
      objectSchema: updateUserSchema,
      pathVariables: [{ type: 'string', name: 'userId' }]
    }
  ])
}

export default userDocs
