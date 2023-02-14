import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

import { adminOperations } from '../utils'

export const categoryList = list({
  access: {
    operation: {
      ...adminOperations,
      query: () => true,
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
  },
})
