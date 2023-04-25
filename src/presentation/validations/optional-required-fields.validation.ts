import { Validation } from '@/presentation/protocols/validation'
import { BadRequestError } from '../errors'

export class OptionalRequiredFieldsValidation implements Validation {
  constructor(private readonly optionalRequiredFields: string[]) {}

  handle = (body: object): void | Error | Promise<Error> => {
    const fieldOneOrMoreFilled: boolean = this.optionalRequiredFields.some(
      (field) => body[field] !== undefined
    )

    if (!fieldOneOrMoreFilled) {
      return Promise.resolve(
        new BadRequestError(
          `Body should have one or more fields filled: ${this.optionalRequiredFields.join(
            ', '
          )}`
        )
      )
    }
  }
}
