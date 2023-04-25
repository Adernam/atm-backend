import { IIdGenerator } from '@/data/protocols/utils'
import { OperationData } from '@/data/services'
import {
  OperationDto,
  OperationModel,
  OperationStatus,
  TypeNote,
} from '@/domain/models'
import { IOperationRepository } from '@/infra/postgres/protocols'

const operationModel: OperationModel = {
  amount: 1000,
  idClient: 'any_id',
  status: OperationStatus.CREATED,
  createdAt: new Date(),
  doneAt: null,
  reservedAt: null,
  id: 'any_id',
  packages: [],
}

class OperationRepositoryMock implements IOperationRepository {
  removeOperation(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  fetchOperations: () => Promise<OperationModel[]>
  addOperation: (
    operationDto: OperationModel | OperationDto
  ) => Promise<OperationModel>
  updateOperation: (
    idOperation: string,
    operationDto: OperationDto
  ) => Promise<OperationModel>

  fetchOperation = async (idOperation: string): Promise<OperationModel> => {
    return Promise.resolve(operationModel)
  }
}
class IdGeneratorMock implements IIdGenerator {
  generate = () => 'any_id'
}
const makeSut = () => {
  const idGeneratorMock = new IdGeneratorMock()
  const operationRepositoryMock = new OperationRepositoryMock()
  const sut = new OperationData(operationRepositoryMock, idGeneratorMock)

  return { sut, idGeneratorMock, operationRepositoryMock }
}

describe('OperationsDataService', () => {
  describe('GetOperation', () => {
    describe('Validation', () => {
      test('Should operationRepository have been called with correct values', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        const operationRepositoryMockSpy = jest.spyOn(
          operationRepositoryMock,
          'fetchOperation'
        )
        await sut.fetchOperation('any_id')

        expect(operationRepositoryMockSpy).toHaveBeenCalledWith('any_id')
      })
      test('Should throw if operationRepository throws', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        jest
          .spyOn(operationRepositoryMock, 'fetchOperation')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.fetchOperation('any_id')

        await expect(promise).rejects.toThrow()
      })
    })
    describe('Success', () => {
      test('Should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.fetchOperation('any_id')

        expect(result).toEqual(operationModel)
      })
    })
  })
})
