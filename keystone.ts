import { config, graphql } from '@keystone-6/core'
import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

import { session, withAuth } from './auth'
import { lists } from './schema'
import { registration } from './src/ext'
import { storage } from './storage'

const onConnect = async (ctx: Context) => {
  const user = await ctx.db.User.findOne({
    where: { email: process.env.ADMIN_EMAIL },
  })

  if (user) return

  await ctx.db.User.createOne({
    data: {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  })
}

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
      useMigrations: true,
      onConnect,
    },
    lists,
    session,
    storage,
    server: {
      port: 8000,
      cors: true,
    },
    extendGraphqlSchema: graphql.extend((base) => {
      return {
        mutation: {
          registration: registration(base),
        },
      }
    }),
  }),
)
