import { OperationModel } from '@/domain/models'

export interface IFetchOperations {
  fetchOperations: (query?: object) => Promise<OperationModel[]>
}
