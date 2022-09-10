import createDoc from '@cig-platform/docs/build/docs/createDoc'
import { authUserSchema, storeUserSchema, updateUserSchema } from '@Schemas/UserSchemas'

const userDocs = {
  ...createDoc('/auth', ['Users'], [
    {
      method: 'post',
      title: 'Auth user',
      objectSchema: authUserSchema,
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    }
  ]),
  ...createDoc('/users', ['Users'], [
    {
      method: 'post',
      title: 'Create user',
      objectSchema: storeUserSchema,
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    },
    {
      method: 'get',
      title: 'Get users',
      queryParams: [{
        name: 'email',
        type: 'string',
      }],
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    }
  ]),
  ...createDoc('/users/{userId}', ['Users'], [
    {
      method: 'patch',
      title: 'Update user',
      objectSchema: updateUserSchema,
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    },
    {
      method: 'delete',
      title: 'Delete user',
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    },
    {
      method: 'get',
      title: 'Get user',
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    }
  ], {
    pathVariables: [{ type: 'string', name: 'userId' }]
  }),
  ...createDoc('/users/{userId}/rollback', ['Users'], [
    {
      method: 'post',
      title: 'Rollback user register',
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    },
  ], {
    pathVariables: [{ type: 'string', name: 'userId' }]
  })
}

export default userDocs
