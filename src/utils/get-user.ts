import type { Context } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema'

interface User {
  id: string
  name: string
  email: string
  basketId: string
  favoritesId: string
}

export const getUserFromSession = async (
  ctx: Context,
  query?: string,
  noUserValue?: false | null | '',
): Promise<User | typeof noUserValue> => {
  const ses = ctx.session

  if (!ses) {
    return noUserValue
  }

  const user = await ctx.query.User.findOne({
    where: {
      id: ses.itemId,
    },
    query,
  })

  return user as User
}
