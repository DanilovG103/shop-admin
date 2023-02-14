import { list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import { relationship } from '@keystone-6/core/fields'

import { isAdmin } from '../utils'

export const favoritesList = list({
  access: {
    operation: {
      ...allOperations(allowAll),
      delete: isAdmin,
    },
  },
  fields: {
    goods: relationship({ ref: 'Good', many: true }),
    user: relationship({ ref: 'User', many: false }),
  },
})
