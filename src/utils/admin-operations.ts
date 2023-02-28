import type { AccessOperation } from '@keystone-6/core/dist/declarations/src/types/config/access-control'
import type {
  BaseListTypeInfo,
  ListOperationAccessControl,
} from '@keystone-6/core/types'

import { isAdmin } from './is-admin'

type Operation<T extends AccessOperation> = ListOperationAccessControl<
  T,
  BaseListTypeInfo
>
interface Operations {
  create: Operation<'create'>
  update: Operation<'update'>
  delete: Operation<'delete'>
}

export const adminOperations: Operations = {
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}
