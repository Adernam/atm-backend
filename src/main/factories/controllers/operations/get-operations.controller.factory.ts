import { GetOperationsController } from '@/presentation/controllers/operations/get-operations.controller'
import { IController } from '@/presentation/protocols'
import { makeOperationData } from '../../data/operation.data.factory'

export const makeGetOperationsController = (): IController => {
  const operationData = makeOperationData()
  return new GetOperationsController(operationData)
}
