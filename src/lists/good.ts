import { graphql, list } from '@keystone-6/core'
import {
  integer,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'
import type { BaseItem, KeystoneContext } from '@keystone-6/core/types'

import { AudienceCategory } from '../enums'
import { adminOperations, getUserFromSession } from '../utils'

const resolveVirtualFields = async (
  ctx: KeystoneContext,
  item: BaseItem,
  field: string,
  whereId: string,
): Promise<boolean> => {
  const data = await ctx.query[field].findOne({
    where: {
      id: whereId,
    },
    query: 'goods { id }',
  })

  if (data === null) {
    return false
  }

  const ids = data.goods.map((good: BaseItem) => good.id)

  return ids.includes(item.id)
}

export const goodList = list({
  access: {
    operation: {
      ...adminOperations,
      query: () => true,
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    description: text({
      validation: { isRequired: true },
      ui: { displayMode: 'textarea' },
    }),
    brand: relationship({ ref: 'Brand' }),
    audienceCategory: select({
      options: [
        { label: 'Мужская', value: AudienceCategory.MALE },
        { label: 'Женская', value: AudienceCategory.FEMALE },
        { label: 'Детская', value: AudienceCategory.KIDS },
      ],
      type: 'enum',
    }),
    category: relationship({ ref: 'Category', many: false }),
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

          return await resolveVirtualFields(ctx, item, 'Basket', user.basketId)
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

          return await resolveVirtualFields(
            ctx,
            item,
            'Favorite',
            user.favoritesId,
          )
        },
      }),
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
})
