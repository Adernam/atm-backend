import {
  OperationStatus,
  TypeNote,
  OperationModel,
  OperationDto,
} from '@/domain/models'
import { randomUUID } from 'crypto'

export const updateOperationDtoMock: OperationDto = {
  amount: 2000,
  idClient: randomUUID(),
  packages: [],
}

export const operationDtoMock: OperationDto = {
  amount: 1000,
  idClient: randomUUID(),
  packages: [],
}

export const operationModelMock: OperationModel = {
  amount: 1000,
  idClient: randomUUID(),
  status: OperationStatus.CREATED,
  createdAt: new Date('2020-01-01'),
  doneAt: new Date('2020-02-01'),
  reservedAt: new Date('2020-02-01'),
  id: randomUUID(),
  packages: [],
}

export const operationsModelMock: OperationModel[] = [
  {
    amount: 1000,
    idClient: randomUUID(),
    status: OperationStatus.CREATED,
    createdAt: new Date('2020-01-01'),
    doneAt: new Date('2020-02-01'),
    reservedAt: new Date('2020-02-01'),
    id: randomUUID(),
    packages: [],
  },
  {
    amount: 1500,
    idClient: randomUUID(),
    status: OperationStatus.DONE,
    createdAt: new Date('2020-02-01'),
    doneAt: new Date('2020-02-02'),
    reservedAt: new Date('2020-03-01'),
    id: randomUUID(),
    packages: [],
  },
]
