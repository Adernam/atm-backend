import { OperationModel, OperationDto } from '@/domain/models'

export interface IUpdateOperation {
  updateOperation: (
    idOperation: string,
    operationDto: OperationDto
  ) => Promise<OperationModel>
}
