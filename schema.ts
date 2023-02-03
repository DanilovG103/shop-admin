import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { image } from '@keystone-6/core/fields'

import {
  basketList,
  brandList,
  goodList,
  requestsList,
  userList,
} from './src/lists'
import type { Lists } from '.keystone/types'

export const lists: Lists = {
  User: userList,
  Good: goodList,
  Basket: basketList,
  Brand: brandList,
  Request: requestsList,
  Image: list({
    access: allowAll,
    fields: {
      image: image({ storage: 'images' }),
    },
  }),
}
