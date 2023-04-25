import { AddOperationController } from '@/presentation/controllers/operations/add-operation.controller'
import { IController } from '@/presentation/protocols'
import { RequiredFieldsValidation } from '@/presentation/validations/required-fields.validation'
import { ValidationCompose } from '@/presentation/validations/validation-compose.validation'
import { makeOperationData } from '../../data/operation.data.factory'

export const makeAddOperationController = (): IController => {
  const requiredFieldsValidation = new RequiredFieldsValidation([
    'amount',
    'packages',
  ])
  const validations = new ValidationCompose([requiredFieldsValidation])
  const operationData = makeOperationData()

  return new AddOperationController(operationData, validations)
}
