import { graphql } from '@keystone-6/core'
import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

import { getUserFromSession } from '../utils'

export const updateMyBasket = (base: graphql.BaseSchemaMeta) => {
  return graphql.field({
    type: base.object('Good'),
    args: {
      id: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
    },
    async resolve(_, { id }, ctx: Context) {
      const user = await getUserFromSession(ctx, 'basketId', null)

      if (!user) {
        return null
      }

      const { isInBasket } = await ctx.query.Good.findOne({
        where: {
          id,
        },
        query: `isInBasket`,
      })

      const option = isInBasket ? 'disconnect' : 'connect'

      await ctx.query.Basket.updateOne({
        where: {
          id: user.basketId,
        },
        data: {
          goods: {
            [option]: [{ id }],
          },
        },
      })

      return {
        id,
        isInBasket: !isInBasket,
      }
    },
  })
}
