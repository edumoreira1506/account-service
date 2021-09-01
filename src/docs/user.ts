import { createDoc } from '@cig-platform/docs'
import { authUserSchema, storeUserSchema } from '@Schemas/UserSchemas'

const userDocs = {
  ...createDoc('/auth', ['Users'], [
    {
      method: 'post',
      title: 'Auth user',
      description: '',
      objectSchema: authUserSchema
    }
  ]),
  ...createDoc('/users', ['Users'], [
    {
      method: 'post',
      title: 'Create user',
      description: '',
      objectSchema: storeUserSchema
    }
  ])
}

export default userDocs
