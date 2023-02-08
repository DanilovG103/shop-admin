import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import {
  integer,
  relationship,
  select,
  text,
  timestamp,
} from '@keystone-6/core/fields'

import { Category } from '../enums/category'

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
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
})
