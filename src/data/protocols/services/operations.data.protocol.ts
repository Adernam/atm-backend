import {
  IAddOperation,
  IFetchOperation,
  IFetchOperations,
  IUpdateOperation,
} from '@/domain/usecases/operations'
import { IRemoveOperation } from '@/domain/usecases/operations/remove-operation.usecase'

export interface IOperationData
  extends IAddOperation,
    IUpdateOperation,
    IFetchOperation,
    IFetchOperations,
    IRemoveOperation {}
