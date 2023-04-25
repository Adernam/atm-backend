import { OperationData } from '@/data/services'
import { UuidAdapter } from '@/infra/adapters/uuid/uuid.adapter'
import { OperationsRepository } from '@/infra/postgres/repository/operations.repository'

export const makeOperationData = (): OperationData => {
  const operationRepository = new OperationsRepository()
  const idGenerator = new UuidAdapter()
  return new OperationData(operationRepository, idGenerator)
}
