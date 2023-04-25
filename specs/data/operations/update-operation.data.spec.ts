import { IIdGenerator } from '@/data/protocols/utils'
import { OperationData } from '@/data/services'
import { OperationDto, OperationModel } from '@/domain/models'
import { IOperationRepository } from '@/infra/postgres/protocols'
import {
  operationDtoMock as operationDto,
  operationModelMock,
} from '../../suport'

class OperationRepositoryMock implements IOperationRepository {
  removeOperation(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  fetchOperations: () => Promise<OperationModel[]>
  addOperation: (
    operationDto: OperationModel | OperationDto
  ) => Promise<OperationModel>
  fetchOperation: (idOperation: string) => Promise<OperationModel>

  updateOperation = (
    idOperation: string,
    operationDto: OperationDto
  ): Promise<OperationModel> => {
    return Promise.resolve(operationModelMock)
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
  describe('UpdateOperation', () => {
    describe('Validation', () => {
      test('Should operationRepository have been called with correct values', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        const operationRepositoryMockSpy = jest.spyOn(
          operationRepositoryMock,
          'updateOperation'
        )
        await sut.updateOperation('any_id', operationDto)

        expect(operationRepositoryMockSpy).toHaveBeenCalledWith(
          'any_id',
          operationDto
        )
      })
      test('Should throw if operationRepository throws', async () => {
        const { sut, operationRepositoryMock } = makeSut()
        jest
          .spyOn(operationRepositoryMock, 'updateOperation')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.updateOperation('any_id', operationDto)

        await expect(promise).rejects.toThrow()
      })
    })
    describe('Success', () => {
      test('Should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.updateOperation('any_id', operationDto)

        expect(result).toEqual(operationModelMock)
      })
    })
  })
})
