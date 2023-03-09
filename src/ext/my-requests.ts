import { graphql } from '@keystone-6/core'
import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

import { getUserFromSession } from '../utils'

export const getMyRequests = (base: graphql.BaseSchemaMeta) => {
  const field = graphql.field({
    type: graphql.list(base.object('Request')),
    args: {
      take: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
      skip: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
    },
    async resolve(_, { take, skip }, ctx: Context) {
      const user = await getUserFromSession(ctx)

      if (!user) return null

      const data = await ctx.query.Request.findMany({
        take,
        skip,
        where: {
          user: {
            id: {
              equals: user.id,
            },
          },
        },
        query: `
          id
          status
          createdAt
        `,
      })

      return data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt), // Query returns createdAt as String, but graphql query needs DateTime
      }))
    },
  })

  return field
}
