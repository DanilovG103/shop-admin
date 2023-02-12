import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { relationship } from '@keystone-6/core/fields'

export const favoritesList = list({
  access: allowAll,
  fields: {
    goods: relationship({ ref: 'Good', many: true }),
    user: relationship({ ref: 'User', many: false }),
  },
})
