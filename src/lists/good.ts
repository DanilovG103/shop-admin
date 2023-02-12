import { graphql, list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import {
  integer,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'

import { Category } from '../enums/category'
import { getUserFromSession } from '../utils'

interface Item {
  id: string
}

export const goodList = list({
  access: allowAll,
  fields: {
    title: text({ validation: { isRequired: true } }),
    description: text({
      validation: { isRequired: true },
      ui: { displayMode: 'textarea' },
    }),
    brand: relationship({ ref: 'Brand' }),
    category: select({
      options: [
        { label: 'Мужская', value: Category.MALE },
        { label: 'Женская', value: Category.FEMALE },
        { label: 'Детская', value: Category.KIDS },
      ],
      type: 'enum',
    }),
    price: integer({ validation: { isRequired: true } }),
    images: relationship({
      ref: 'Image',
      many: true,
    }),
    isInBasket: virtual({
      field: graphql.field({
        type: graphql.Boolean,
        async resolve(item, _, ctx) {
          const user = await getUserFromSession(ctx, 'basketId', false)

          if (!user) {
            return false
          }

          const basket = await ctx.query.Basket.findOne({
            where: {
              id: user.basketId,
            },
            query: 'goods { id }',
          })

          if (basket === null) {
            return false
          }

          const ids = basket.goods.map((good: Item) => good.id)

          return ids.includes((item as Item).id)
        },
      }),
    }),
    isInFavorite: virtual({
      field: graphql.field({
        type: graphql.Boolean,
        async resolve(item, _, ctx) {
          const user = await getUserFromSession(ctx, 'favoritesId', false)

          if (!user) {
            return false
          }

          const favorites = await ctx.query.Favorite.findOne({
            where: {
              id: user.favoritesId,
            },
            query: 'goods { id }',
          })

          if (favorites === null) {
            return false
          }

          const ids = favorites.goods.map((good: Item) => good.id)

          return ids.includes((item as Item).id)
        },
      }),
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
})
