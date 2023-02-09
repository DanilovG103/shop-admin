import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { relationship, select, text } from '@keystone-6/core/fields'

import { RequestStatus } from '../enums/status'

export const requestsList = list({
  access: allowAll,
  fields: {
    data: relationship({
      ref: 'Basket',
      many: false,
    }),
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
