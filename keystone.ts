import { config, graphql } from '@keystone-6/core'
import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

import { session, withAuth } from './auth'
import { lists } from './schema'
import { Role } from './src/enums'
import {
  addresses,
  registration,
  updateMyBasket,
  updateMyFavorite,
} from './src/ext'
import { isAdmin } from './src/utils'
import { storage } from './storage'

const onConnect = async (ctx: Context) => {
  setTimeout(async () => {
    const user = await ctx.db.User.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    })

    if (user) return

    await ctx.db.User.createOne({
      data: {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: Role.ADMIN,
      },
    })
  }, 5000)
}

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
      useMigrations: true,
      onConnect,
      // enableLogging: true,
    },
    ui: {
      isAccessAllowed: isAdmin,
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
        query: {
          addresses,
        },
        mutation: {
          registration: registration(base),
          updateMyFavorite: updateMyFavorite(base),
          updateMyBasket: updateMyBasket(base),
        },
      }
    }),
  }),
)
