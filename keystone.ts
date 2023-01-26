import { config } from '@keystone-6/core'

import { session, withAuth } from './auth'
import { lists } from './schema'
import { storage } from './storage'

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
      useMigrations: true,
      onConnect: async ({ db }) => {
        const user = await db.User.findOne({
          where: { email: process.env.ADMIN_EMAIL },
        })

        if (user) return

        await db.User.createOne({
          data: {
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
          },
        })
      },
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
