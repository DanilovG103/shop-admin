import type {
  BaseListTypeInfo,
  ListOperationAccessControl,
} from '@keystone-6/core/types'

import { isAdmin } from './is-admin'

interface Operations {
  create: ListOperationAccessControl<'create', BaseListTypeInfo>
  update: ListOperationAccessControl<'update', BaseListTypeInfo>
  delete: ListOperationAccessControl<'delete', BaseListTypeInfo>
}

export const adminOperations: Operations = {
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}
