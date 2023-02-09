import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { password, text, timestamp } from '@keystone-6/core/fields'

export const userList = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    password: password({ validation: { isRequired: true } }),
    basketId: text({
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
  hooks: {
    async afterOperation({ operation, item, context }) {
      if (operation === 'create') {
        const basket = await context.db.Basket.createOne({
          data: {
            goods: { create: [] },
            user: { connect: { id: item.id } },
          },
        })

        await context.db.User.updateOne({
          where: {
            id: item.id.toString(),
          },
          data: {
            basketId: basket.id,
          },
        })
      }
    },
  },
})
