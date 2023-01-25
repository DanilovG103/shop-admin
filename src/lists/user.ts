import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { password, text, timestamp } from '@keystone-6/core/fields'

export const userList = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    password: password({ validation: { isRequired: true } }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})
