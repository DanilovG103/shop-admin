import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { image } from '@keystone-6/core/fields'

import { goodList } from './src/lists/good'
import { userList } from './src/lists/user'
import type { Lists } from '.keystone/types'

export const lists: Lists = {
  User: userList,
  Good: goodList,
  Image: list({
    access: allowAll,
    fields: {
      image: image({ storage: 'images' }),
    },
  }),
}
