import { OperationModel } from '@/domain/models'

export interface IFetchOperation {
  fetchOperation: (idOperation: string) => Promise<OperationModel>
}
