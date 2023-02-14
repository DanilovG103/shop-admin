import { graphql } from '@keystone-6/core'
import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

import { Role } from './../enums'

interface Result {
  authenticateUserWithPassword: Record<string, unknown>
}

export const registration = (base: graphql.BaseSchemaMeta) => {
  return graphql.field({
    type: base.union('UserAuthenticationWithPasswordResult'),
    args: {
      name: graphql.arg({ type: graphql.nonNull(graphql.String) }),
      email: graphql.arg({ type: graphql.nonNull(graphql.String) }),
      password: graphql.arg({ type: graphql.nonNull(graphql.String) }),
    },
    async resolve(_, { email, password, name }, ctx: Context) {
      const user = await ctx.query.User.findOne({
        where: {
          email,
        },
      })

      if (user) {
        throw new Error('Пользователь с таким email уже есть')
      }

      await ctx.db.User.createOne({
        data: {
          email,
          password,
          name,
          role: Role.USER,
        },
      })

      const result = await ctx.graphql.run({
        query: `
        mutation Auth($email: String!, $password: String!) {
          authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
              sessionToken
              item {
                id
                name
                email
                basketId
                favoritesId
              }
            }
            ... on UserAuthenticationWithPasswordFailure {
              message
            }
          }
        }`,
        variables: {
          email,
          password,
        },
      })

      return (result as Result).authenticateUserWithPassword
    },
  })
}
