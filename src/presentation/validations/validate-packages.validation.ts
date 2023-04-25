import { PackageDto } from '@/domain/models'
import { Validation } from '../protocols/validation'
import { RequiredFieldsValidation } from './required-fields.validation'

export class ValidatePackages implements Validation {
  handle = (body: any): void | Error | Promise<void | Error> => {
    const packages: PackageDto[] = body.packages

    if (!packages || !Array.isArray(packages) || !packages.length) {
      return new Error('Packages must be an array and not empty')
    }

    const validateRequiredFields = new RequiredFieldsValidation([
      'quantityNote',
      'typeNote',
      'openedAt',
      'closedAt',
      'status',
      'idOperation',
    ])

    for (const pkg of packages) {
      const error = validateRequiredFields.handle(pkg)
      if (error instanceof Error) {
        return error
      }
    }

    return Promise.resolve()
  }
}
