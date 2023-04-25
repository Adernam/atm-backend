import { Validation } from '@/presentation/protocols/validation'
import { BadRequestError } from '../errors'

export class RequiredFieldsValidation implements Validation {
  constructor(private readonly requiredFields: string[]) {}

  handle = (body: object): void | Error | Promise<Error> => {
    if (!body || !Object.keys(body).length) {
      return Promise.resolve(new BadRequestError('Invalid body request'))
    }

    const fieldsNotFilled: string[] = this.requiredFields.reduce(
      (prev, curr) => {
        if (body[curr] === undefined) {
          prev.push(curr)
        }
        return prev
      },
      []
    )

    if (fieldsNotFilled.length) {
      return Promise.resolve(
        new BadRequestError(
          `Required fields missing: ${fieldsNotFilled.join(', ')}`
        )
      )
    }
  }
}
