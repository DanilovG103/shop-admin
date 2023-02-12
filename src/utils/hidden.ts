import { text } from '@keystone-6/core/fields'

export const hiddenText = text({
  ui: {
    createView: {
      fieldMode: 'hidden',
    },
    itemView: {
      fieldMode: 'read',
    },
  },
})
