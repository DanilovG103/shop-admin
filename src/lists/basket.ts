import { graphql } from '@graphql-ts/schema'
import { list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import { relationship, virtual } from '@keystone-6/core/fields'

import { isAdmin } from '../utils'

interface Item {
  id: string
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
          const data: GoodQuery[] = await ctx.query.Basket.findMany({
            where: {
              user: {
                id: {
                  equals: (item as Item).userId,
                },
              },
            },
            query: 'goods { price }',
          })

          const resolved: number[] = data[0]
            ? data[0].goods.map((el) => el.price)
            : []

          return resolved.reduce((acc, curr) => acc + curr, 0)
        },
      }),
    }),
  },
})
