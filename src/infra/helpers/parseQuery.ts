import { IsNull } from 'typeorm'

export const parseQuery = (query: object) => {
  return Object.entries(query).reduce((prev, [key, value]) => {
    if (value === null) {
      prev[key] = IsNull()
    }

    prev[key] = value

    return prev
  }, {})
}
