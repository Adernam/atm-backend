import { IController } from '@/presentation/protocols'
import { makeOperationData } from '../../data/operation.data.factory'
import { RemoveOperationController } from '@/presentation/controllers/operations/delete-operation.controller'

export const makeRemoveOperationController = (): IController => {
  const operationData = makeOperationData()

  return new RemoveOperationController(operationData)
}
