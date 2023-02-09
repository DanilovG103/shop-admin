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
          if (!ctx.session?.itemId) {
            return false
          }

          const userId = ctx.session.itemId

          const user = await ctx.db.User.findOne({
            where: {
              id: userId,
            },
          })

          const basket = await ctx.query.Basket.findOne({
            where: {
              id: typeof user?.basketId === 'string' ? user.basketId : '',
            },
            query: 'goods { id }',
          })

          const ids = basket.goods.map((good: Item) => good.id)

          return ids.includes((item as Item).id)
        },
      }),
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
})
