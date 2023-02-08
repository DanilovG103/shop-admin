import { config } from '@keystone-6/core'
import type { KeystoneContext } from '@keystone-6/core/dist/declarations/src/types'

import { session, withAuth } from './auth'
import { lists } from './schema'
import { storage } from './storage'

const onConnect = async (ctx: KeystoneContext) => {
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
  }),
)
