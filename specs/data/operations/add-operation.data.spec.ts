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
const operationDto: OperationDto = {
  amount: 1000,
  idClient: 'any_id',
  packages: [],
}

class OperationRepositoryMock implements IOperationRepository {
  removeOperation(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  fetchOperations: () => Promise<OperationModel[]>
  updateOperation: (
    idOperation: string,
    operationDto: OperationDto
  ) => Promise<OperationModel>
  fetchOperation: (idOperation: string) => Promise<OperationModel>

  addOperation = (operationDto: OperationDto): Promise<OperationModel> => {
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
  describe('AddOperation', () => {
    describe('Validation', () => {
      test('Should return throw if idGenerator throws', async () => {
        const { sut, idGeneratorMock } = makeSut()
        jest.spyOn(idGeneratorMock, 'generate').mockImplementation(() => {
          throw new Error()
        })
        const promise = sut.addOperation(operationDto)

        await expect(promise).rejects.toThrow()
      })
      test('Should throw if operationRepository throws', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        jest
          .spyOn(operationRepositoryMock, 'addOperation')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.addOperation(operationDto)

        await expect(promise).rejects.toThrow()
      })
      test('Should operationRepository have been called with correct values', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        const operationRepositoryMockSpy = jest.spyOn(
          operationRepositoryMock,
          'addOperation'
        )
        await sut.addOperation(operationDto)

        expect(operationRepositoryMockSpy).toHaveBeenCalledWith({
          id: 'any_id',
          idClient: operationDto.idClient,
          amount: operationDto.amount,
          status: OperationStatus.CREATED,
          createdAt: expect.any(Date),
          reservedAt: null,
          doneAt: null,
          packages: [],
        })
      })
    })
    describe('Success', () => {
      test('Should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.addOperation(operationDto)

        expect(result).toEqual(operationModel)
      })
    })
  })
})
