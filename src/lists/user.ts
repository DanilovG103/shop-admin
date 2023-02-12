import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { password, text, timestamp } from '@keystone-6/core/fields'
import type { BaseItem } from '@keystone-6/core/types'

import { hiddenText } from '../utils'

const afterCreateInput = (item: BaseItem) => ({
  goods: { create: [] },
  user: { connect: { id: item.id } },
})

interface DeleteData extends BaseItem {
  basketId: string
  favoritesId: string
}

export const userList = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    password: password({ validation: { isRequired: true } }),
    basketId: hiddenText,
    favoritesId: hiddenText,
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
  hooks: {
    async afterOperation({ operation, item, context, originalItem }) {
      if (operation === 'create') {
        const basket = await context.db.Basket.createOne({
          data: afterCreateInput(item),
        })

        const favorites = await context.db.Favorite.createOne({
          data: afterCreateInput(item),
        })

        await context.db.User.updateOne({
          where: {
            id: item.id.toString(),
          },
          data: {
            basketId: basket.id,
            favoritesId: favorites.id,
          },
        })
      }

      if (operation === 'delete') {
        await context.db.Basket.deleteOne({
          where: {
            id: (originalItem as DeleteData).basketId,
          },
        })

        await context.db.Favorite.deleteOne({
          where: {
            id: (originalItem as DeleteData).favoritesId ?? '',
          },
        })
      }
    },
  },
})
