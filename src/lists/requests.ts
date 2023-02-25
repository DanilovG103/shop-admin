import { list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import { relationship, select, text, timestamp } from '@keystone-6/core/fields'

import { RequestStatus } from '../enums'
import { isAdmin } from '../utils'

export const requestsList = list({
  access: {
    operation: {
      ...allOperations(allowAll),
      delete: isAdmin,
    },
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
    user: relationship({ ref: 'User', many: false }),
    rejectReason: text(),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
  hooks: {
    async afterOperation({ operation, context, inputData }) {
      if (operation === 'create') {
        const user = await context.query.User.findOne({
          where: {
            id: inputData.user.connect.id,
          },
          query: `basketId`,
        })

        await context.query.Basket.updateOne({
          where: {
            id: user.basketId,
          },
          data: {
            goods: {
              disconnect: inputData.goods.connect,
            },
          },
        })
      }
    },
  },
})
