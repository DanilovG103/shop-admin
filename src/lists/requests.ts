import { list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import {
  integer,
  relationship,
  select,
  text,
  timestamp,
} from '@keystone-6/core/fields'

import { PaymentType, RequestStatus } from '../enums'
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
        { label: 'Создан', value: RequestStatus.CREATED },
        { label: 'Принят', value: RequestStatus.FULFILLED },
        { label: 'Доставлен', value: RequestStatus.DELIVERED },
        { label: 'Отменен', value: RequestStatus.CANCELLED }, // user only
        { label: 'Отклонен', value: RequestStatus.REJECTED },
      ],
      type: 'enum',
      defaultValue: RequestStatus.CREATED,
    }),
    user: relationship({ ref: 'User', many: false }),
    recipientName: text(),
    recipientEmail: text(),
    phone: text({ validation: { isRequired: true } }),
    sum: integer({ validation: { isRequired: true } }),
    address: text({ validation: { isRequired: true } }),
    paymentType: select({
      options: [
        {
          label: 'При получении',
          value: PaymentType.RECEIVING,
        },
        {
          label: 'Картой онлайн',
          value: PaymentType.ONLINE,
        },
      ],
      type: 'enum',
    }),
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
