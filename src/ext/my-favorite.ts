import { graphql } from '@keystone-6/core'
import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

import { getUserFromSession } from '../utils'

export const updateMyFavorite = (base: graphql.BaseSchemaMeta) => {
  return graphql.field({
    type: base.object('Good'),
    args: {
      id: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
    },
    async resolve(_, { id }, ctx: Context) {
      const user = await getUserFromSession(ctx, 'favoritesId', null)

      if (!user) {
        return null
      }

      const { isInFavorite } = await ctx.query.Good.findOne({
        where: {
          id,
        },
        query: `isInFavorite`,
      })

      const option = isInFavorite ? 'disconnect' : 'connect'

      await ctx.query.Favorite.updateOne({
        where: {
          id: user.favoritesId,
        },
        data: {
          goods: {
            [option]: [{ id }],
          },
        },
      })

      return {
        id,
        isInFavorite: !isInFavorite,
      }
    },
  })
}
