import { config } from '@keystone-6/core'

import { session, withAuth } from './auth'
import { lists } from './schema'
import { storage } from './storage'

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
      // onConnect: async ({ db }) => {
      //   const user = await db.User.findOne({
      //     where: { email: 'admin@admin.com' },
      //   })

      //   if (user) return

      //   await db.User.createOne({
      //     data: {
      //       name: 'admin',
      //       email: 'admin@admin.com',
      //       password: 'administrator',
      //     },
      //   })
      // },
    },
    lists,
    session,
    storage,
    server: {
      port: 8000,
      cors: true,
    },
  }),
)
