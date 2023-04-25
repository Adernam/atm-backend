import { Validation } from '../protocols/validation'

export class ValidationCompose implements Validation {
  constructor(private readonly validations: Validation[]) {}

  async handle(value: any): Promise<void | Error> {
    for (const validation of this.validations) {
      const error = await validation.handle(value)
      if (error) {
        return error
      }
    }
  }
}
