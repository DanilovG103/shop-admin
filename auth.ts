import { createAuth } from '@keystone-6/auth'
import { statelessSessions } from '@keystone-6/core/session'
import { randomBytes } from 'crypto'

let sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret && process.env.NODE_ENV !== 'production') {
  sessionSecret = randomBytes(32).toString('hex')
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'name createdAt role',
  secretField: 'password',
})

const sessionMaxAge = 60 * 60 * 24 * 30

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
  secure: true,
  sameSite: 'lax',
})

export { withAuth, session }
