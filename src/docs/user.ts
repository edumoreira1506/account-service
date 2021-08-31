import { createDoc } from '@cig-platform/docs'
import { storeUserSchema } from '@Schemas/UserSchemas'

const userDocs = {
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
