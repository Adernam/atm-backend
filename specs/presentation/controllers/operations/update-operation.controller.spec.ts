import { updateOperationDtoMock, operationModelMock } from '@/../specs/suport'
import { IOperationData } from '@/data/protocols/services'
import { OperationDto, OperationModel } from '@/domain/models'
import { UpdateOperationController } from '@/presentation/controllers/operations'
import { Token } from '@/presentation/protocols/token-header'
import { OptionalRequiredFieldsValidation } from '@/presentation/validations/optional-required-fields.validation'
import { ValidationCompose } from '@/presentation/validations/validation-compose.validation'

const token: Token = {
  data: {
    idClient: 'valid_id_client',
  },
}
class OperationData implements IOperationData {
  fetchOperations: (query: Record<string, any>) => Promise<OperationModel[]>

  removeOperation(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  addOperation: (
    updateOperationDtoMock: OperationDto | OperationModel
  ) => Promise<OperationModel>
  fetchOperation: (idOperation: string) => Promise<OperationModel>

  updateOperation = async (idOperation: string): Promise<OperationModel> => {
    return Promise.resolve(operationModelMock)
  }
}
const makeSut = () => {
  const operationDataMock = new OperationData()
  const validations = new ValidationCompose([
    new OptionalRequiredFieldsValidation([
      'amount',
      'typeNote',
      'status',
      'createdAt',
      'reservedAt',
      'doneAt',
    ]),
  ])
  const sut = new UpdateOperationController(operationDataMock, validations)

  return {
    sut,
    operationDataMock,
  }
}

describe('UpdateOperationController', () => {
  describe('Validation', () => {
    test.each([null, ''])(
      'Should return status 400 badResquest if param is %p',
      async (value) => {
        const { sut } = makeSut()
        const result = await sut.handle({
          body: updateOperationDtoMock,
          params: { id: value },
          token,
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toBe('Invalid operation id on path params.')
      }
    )

    test('Should return status 400 badResquest if body is empty', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({
        body: {},
        params: { id: 'any_id' },
        token,
      })
      console.log(
        '🚀 ~ file: update-operation.controller.spec.ts:61 ~ test ~ result:',
        result
      )

      expect(result.statusCode).toBe(400)
      expect(result.body).toBe(
        'Body should have one or more fields filled: amount, typeNote, status, createdAt, reservedAt, doneAt'
      )
    })

    test('Should return status 500 if operation data throws', async () => {
      const { sut, operationDataMock } = makeSut()
      jest
        .spyOn(operationDataMock, 'updateOperation')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const result = await sut.handle({ body: updateOperationDtoMock, token })

      expect(result.statusCode).toBe(500)
    })

    test('Should return status 404 if operation data returns null', async () => {
      const { sut, operationDataMock } = makeSut()
      jest.spyOn(operationDataMock, 'updateOperation').mockResolvedValue(null)
      const result = await sut.handle({
        body: updateOperationDtoMock,
        params: { id: 'any_id' },
        token,
      })

      expect(result.statusCode).toBe(404)
    })

    test('Should operationData have been called with correct params', async () => {
      const { sut, operationDataMock } = makeSut()
      const updateOperationsSpy = jest.spyOn(
        operationDataMock,
        'updateOperation'
      )
      await sut.handle({
        body: updateOperationDtoMock,
        params: { id: 'any_id' },
        token,
      })
      expect(updateOperationsSpy).toHaveBeenCalledTimes(1)
      expect(updateOperationsSpy).toHaveBeenCalledWith('any_id', {
        ...updateOperationDtoMock,
        idClient: 'valid_id_client',
      })
    })
  })
  describe('Success', () => {
    test('Should return correct values', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({
        body: updateOperationDtoMock,
        params: { id: 'any_id' },
        token,
      })

      expect(result.statusCode).toBe(200)
      expect(result.body).toBe(operationModelMock)
    })
  })
})
