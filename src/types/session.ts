import { Role } from '../enums'

interface Data {
  name: string
  createdAt: Date
  role: Role
}

export interface Session {
  data: Data
}
