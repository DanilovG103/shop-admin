import { graphql, list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import { relationship, virtual } from '@keystone-6/core/fields'
import type { BaseItem } from '@keystone-6/core/types'

import { isAdmin } from '../utils'

interface Item extends BaseItem {
  userId: string
}

interface GoodQuery {
  goods: {
    price: number
  }[]
}

export const basketList = list({
  access: {
    operation: {
      ...allOperations(allowAll),
      delete: isAdmin,
    },
  },
  fields: {
    goods: relationship({ ref: 'Good', many: true }),
    user: relationship({ ref: 'User', many: false }),
    sum: virtual({
      field: graphql.field({
        type: graphql.Int,
        async resolve(item, args, ctx) {
          const data = (await ctx.query.Basket.findMany({
            where: {
              user: {
                id: {
                  equals: (item as Item).userId,
                },
              },
            },
            query: 'goods { price }',
          })) as GoodQuery[]

          const resolved: number[] = data[0]
            ? data[0].goods.map((el) => el.price)
            : []

          return resolved.reduce((acc, curr) => acc + curr, 0)
        },
      }),
    }),
  },
})
