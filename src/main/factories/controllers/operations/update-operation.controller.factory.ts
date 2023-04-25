import { UpdateOperationController } from '@/presentation/controllers/operations/update-operation.controller'
import { ValidationCompose } from '@/presentation/validations/validation-compose.validation'
import { makeOperationData } from '../../data/operation.data.factory'
import { RequiredFieldsValidation } from '@/presentation/validations'

export const makeUpdateOperationController = () => {
  const operationData = makeOperationData()

  const validations = new ValidationCompose([
    new RequiredFieldsValidation([
      'amount',
      'status',
      'createdAt',
      'doneAt',
      'reservedAt',
      'packages',
    ]),
  ])

  return new UpdateOperationController(operationData, validations)
}
