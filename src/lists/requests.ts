import { list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import { relationship, select, text } from '@keystone-6/core/fields'

import { RequestStatus } from '../enums'
import { isAdmin } from '../utils'

export const requestsList = list({
  access: {
    operation: {
      ...allOperations(allowAll),
      delete: isAdmin,
    },
    // TODO: ADD FILTER FOR USER
  },
  fields: {
    goods: relationship({ ref: 'Good', many: true }),
    status: select({
      options: [
        { label: 'Ожидание', value: RequestStatus.PENDING },
        { label: 'Принят', value: RequestStatus.FULFILLED },
        { label: 'Отклонен', value: RequestStatus.REJECTED },
      ],
      type: 'enum',
      defaultValue: RequestStatus.PENDING,
    }),
    rejectReason: text(),
  },
})
