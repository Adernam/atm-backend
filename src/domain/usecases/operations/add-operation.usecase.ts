import { OperationDto, OperationModel } from '@/domain/models'

export interface IAddOperation {
  addOperation: (
    operationDto: OperationDto | OperationModel
  ) => Promise<OperationModel>
}
