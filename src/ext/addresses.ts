import { graphql } from '@keystone-6/core'

const type = graphql.object<string[]>()({
  name: 'Address',
  fields: {
    value: graphql.field({
      type: graphql.list(graphql.String),
      resolve(value) {
        return value
      },
    }),
  },
})

export const addresses = graphql.field({
  type,
  args: {
    query: graphql.arg({ type: graphql.String }),
  },
  async resolve(_, { query }) {
    const url =
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Token ' + process.env.DADATA_API_KEY,
      },
      body: JSON.stringify({ query }),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    const value = data.suggestions.map((item: { value: string }) => item.value)

    return value
  },
})
