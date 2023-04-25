import { operationDtoMock, operationsModelMock } from '@/../specs/suport'
import { token } from '@/../specs/suport/mocks'
import { OperationModel } from '@/domain/models'
import { IFetchOperations } from '@/domain/usecases/operations'
import { GetOperationsController } from '@/presentation/controllers/operations'

class OperationData implements IFetchOperations {
  fetchOperations = async (): Promise<OperationModel[]> => {
    return Promise.resolve(operationsModelMock)
  }
}
const makeSut = () => {
  const operationDataMock = new OperationData()
  const sut = new GetOperationsController(operationDataMock)

  return {
    sut,
    operationDataMock,
  }
}

describe('GetOperationsController', () => {
  describe('Validation', () => {
    test('Should return status 500 if operation data throws', async () => {
      const { sut, operationDataMock } = makeSut()
      jest
        .spyOn(operationDataMock, 'fetchOperations')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const result = await sut.handle({ body: operationDtoMock })

      expect(result.statusCode).toBe(500)
    })
  })
  describe('Success', () => {
    test('Should return correct values', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({ token })

      expect(result.statusCode).toBe(200)
      expect(result.body).toBe(operationsModelMock)
    })
  })
})
