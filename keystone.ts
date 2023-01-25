import { config } from '@keystone-6/core'

import { session, withAuth } from './auth'
import { lists } from './schema'
import { storage } from './storage'

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    lists,
    session,
    storage,
    server: {
      port: 3000,
      cors: true,
    },
  }),
)
