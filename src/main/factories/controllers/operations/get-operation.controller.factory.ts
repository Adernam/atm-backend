import { GetOperationController } from '@/presentation/controllers/operations/get-operation.controller'
import { IController } from '@/presentation/protocols'
import { makeOperationData } from '../../data/operation.data.factory'

export const makeGetOperationController = (): IController => {
  const operationData = makeOperationData()
  return new GetOperationController(operationData)
}
