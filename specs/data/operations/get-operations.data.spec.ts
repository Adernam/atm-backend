import { IIdGenerator } from '@/data/protocols/utils'
import { OperationData } from '@/data/services'
import {
  OperationDto,
  OperationModel,
  OperationStatus,
  TypeNote,
} from '@/domain/models'
import { IOperationRepository } from '@/infra/postgres/protocols'

const operationModel: OperationModel[] = [
  {
    amount: 1000,
    idClient: 'any_id',
    status: OperationStatus.CREATED,
    createdAt: new Date(),
    doneAt: new Date(),
    reservedAt: new Date(),
    id: 'any_id',
    packages: [],
  },
  {
    amount: 1500,
    idClient: 'any_idd',
    status: OperationStatus.DONE,
    createdAt: new Date('2020-02-01'),
    doneAt: new Date('2020-02-02'),
    reservedAt: new Date('2020-03-01'),
    id: 'any_idd',
    packages: [],
  },
]

class OperationsRepositoryMock implements IOperationRepository {
  removeOperation(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  addOperation: (
    operationDto: OperationModel | OperationDto
  ) => Promise<OperationModel>
  updateOperation: (
    idOperation: string,
    operationDto: OperationDto
  ) => Promise<OperationModel>
  fetchOperation: (idOperation: string) => Promise<OperationModel>

  fetchOperations = async (): Promise<OperationModel[]> => {
    return Promise.resolve(operationModel)
  }
}
class IdGeneratorMock implements IIdGenerator {
  generate = () => 'any_id'
}
const makeSut = () => {
  const idGeneratorMock = new IdGeneratorMock()
  const operationRepositoryMock = new OperationsRepositoryMock()
  const sut = new OperationData(operationRepositoryMock, idGeneratorMock)

  return { sut, idGeneratorMock, operationRepositoryMock }
}

describe('OperationsDataService', () => {
  describe('GetOperations', () => {
    describe('Validation', () => {
      test('Should throw if operationRepository throws', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        jest
          .spyOn(operationRepositoryMock, 'fetchOperations')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.fetchOperations({})

        await expect(promise).rejects.toThrow()
      })
    })
    describe('Success', () => {
      test('Should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.fetchOperations({})

        expect(result).toEqual(operationModel)
      })
    })
  })
})
