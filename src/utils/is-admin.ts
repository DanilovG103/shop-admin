import { Role } from '../enums'
import type { Session } from '../types'

interface Args {
  session?: Session
}

export const isAdmin = ({ session }: Args) => {
  if (!session) return false

  return session.data.role === Role.ADMIN
}
