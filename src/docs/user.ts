import createDoc from '@cig-platform/docs/build/docs/createDoc'
import { authUserSchema, storeUserSchema, updateUserSchema } from '@Schemas/UserSchemas'

const userDocs = {
  ...createDoc('/auth', ['Users'], [
    {
      method: 'post',
      title: 'Auth user',
      objectSchema: authUserSchema,
    }
  ]),
  ...createDoc('/users', ['Users'], [
    {
      method: 'post',
      title: 'Create user',
      objectSchema: storeUserSchema
    },
    {
      method: 'get',
      title: 'Get users',
      queryParams: [{
        name: 'email',
        type: 'string',
      }]
    }
  ]),
  ...createDoc('/users/{userId}', ['Users'], [
    {
      method: 'patch',
      title: 'Update user',
      objectSchema: updateUserSchema,
    },
    {
      method: 'delete',
      title: 'Delete user',
    },
    {
      method: 'get',
      title: 'Get user',
    }
  ], {
    pathVariables: [{ type: 'string', name: 'userId' }]
  }),
  ...createDoc('/users/{userId}/rollback', ['Users'], [
    {
      method: 'post',
      title: 'Rollback user register',
    },
  ], {
    pathVariables: [{ type: 'string', name: 'userId' }]
  })
}

export default userDocs
