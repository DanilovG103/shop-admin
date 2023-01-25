import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import {
  checkbox,
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
    category: select({
      options: [
        { label: 'Male', value: Category.MALE },
        { label: 'Female', value: Category.FEMALE },
        { label: 'Kids', value: Category.KIDS },
      ],
    }),
    price: integer({ validation: { isRequired: true } }),
    promotion: checkbox(),
    images: relationship({
      ref: 'Image',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['image'],
        inlineCreate: { fields: ['image'] },
        inlineEdit: { fields: ['image'] },
      },
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
})
