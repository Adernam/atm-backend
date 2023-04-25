import { operationModelMock, operationDtoMock } from '@/../specs/suport'
import { OperationModel } from '@/domain/models'
import { IFetchOperation } from '@/domain/usecases/operations'
import { GetOperationController } from '@/presentation/controllers/operations'

class OperationData implements IFetchOperation {
  fetchOperation = async (idOperation: string): Promise<OperationModel> => {
    return Promise.resolve(operationModelMock)
  }
}
const makeSut = () => {
  const operationDataMock = new OperationData()
  const sut = new GetOperationController(operationDataMock)

  return {
    sut,
    operationDataMock,
  }
}

describe('GetOperationController', () => {
  describe('Validation', () => {
    test.each([null, ''])(
      'Should return badResquest if param is %p',
      async (value) => {
        const { sut } = makeSut()
        const result = await sut.handle({ body: {}, params: { id: value } })

        expect(result.statusCode).toBe(400)
        expect(result.body).toBe('Invalid operation id on path params')
      }
    )

    test('Should return status 500 if operation data throws', async () => {
      const { sut, operationDataMock } = makeSut()
      jest
        .spyOn(operationDataMock, 'fetchOperation')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const result = await sut.handle({ body: operationDtoMock })

      expect(result.statusCode).toBe(500)
    })

    test('Should return status 404 if operation data returns null', async () => {
      const { sut, operationDataMock } = makeSut()
      jest.spyOn(operationDataMock, 'fetchOperation').mockResolvedValue(null)
      const result = await sut.handle({
        body: operationDtoMock,
        params: { id: 'any_id' },
      })

      expect(result.statusCode).toBe(404)
    })
  })
  describe('Success', () => {
    test('Should return correct values', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({
        body: operationDtoMock,
        params: { id: operationModelMock.id },
      })

      expect(result.statusCode).toBe(200)
      expect(result.body).toBe(operationModelMock)
    })
  })
})
