import { operationDtoMock, operationModelMock } from '@/../specs/suport'
import { OperationDto, OperationModel } from '@/domain/models'
import { IAddOperation } from '@/domain/usecases/operations'
import { AddOperationController } from '@/presentation/controllers/operations/add-operation.controller'
import { Token } from '@/presentation/protocols/token-header'
import { RequiredFieldsValidation } from '@/presentation/validations/required-fields.validation'
import { ValidationCompose } from '@/presentation/validations/validation-compose.validation'

const token: Token = {
  data: { idClient: 'id_client' },
}
class OperationData implements IAddOperation {
  addOperation = async (
    operationDtoMock: OperationDto
  ): Promise<OperationModel> => {
    return Promise.resolve(operationModelMock)
  }
}
const makeSut = () => {
  const operationDataMock = new OperationData()

  //TODO: get validations from main
  const requiredFieldsValidation = new RequiredFieldsValidation([
    'amount',
    'idClient',
  ])
  const validations = new ValidationCompose([requiredFieldsValidation])
  const sut = new AddOperationController(operationDataMock, validations)

  return {
    sut,
    operationDataMock,
  }
}

describe('AddOperationController', () => {
  describe('Validation', () => {
    test('Should return badResquest on validation body', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({ body: { unknown: '' }, token })

      expect(result.statusCode).toBe(400)
      expect(result.body).toBe('Required fields missing: amount, idClient')
    })

    test('Should return status 500 if operation data throws', async () => {
      const { sut, operationDataMock } = makeSut()
      jest
        .spyOn(operationDataMock, 'addOperation')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const result = await sut.handle({ body: operationDtoMock, token })

      expect(result.statusCode).toBe(500)
    })
  })
  describe('Success', () => {
    test('Should return correct values', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({ body: operationDtoMock, token })

      expect(result.statusCode).toBe(200)
      expect(result.body).toBe(operationModelMock)
    })
  })
})
