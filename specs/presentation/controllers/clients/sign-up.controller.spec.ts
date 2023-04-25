import { clientModelMock, clientsModelMock } from '@/../specs/suport'
import { ClientModel } from '@/domain/models'
import { IAddClient, IFetchClients } from '@/domain/usecases/clients'
import { SignUpController } from '@/presentation/controllers/clients'
import { ClientDTO } from '@/presentation/dto'
import { HttpRequest } from '@/presentation/protocols'
import { Token, TokenEncoded } from '@/presentation/protocols/token-header'
import {
  ClientAlreadyExistsValidation,
  RequiredFieldsValidation,
  ValidationCompose,
} from '@/presentation/validations'

const httpRequestMock: HttpRequest = {
  body: clientModelMock,
}
const encodedTokenMock = { token: 'token' }
class ClientMock implements IAddClient, IFetchClients {
  fetchClients = (query?: object): Promise<ClientModel[]> => {
    return new Promise((resolve) => resolve(clientsModelMock))
  }
  addClient(clientDto: ClientDTO): Promise<TokenEncoded> {
    return new Promise((resolve) => resolve(encodedTokenMock))
  }
}

const makeSut = () => {
  const clientDataMock = new ClientMock()
  const validations = new ValidationCompose([
    new RequiredFieldsValidation([
      'name',
      'address',
      'birthDate',
      'cpf',
      'email',
      'password',
    ]),
    new ClientAlreadyExistsValidation(clientDataMock),
  ])
  const sut = new SignUpController(clientDataMock, validations)

  return { sut, addClientMock: clientDataMock }
}

describe('SignUpController', () => {
  describe('Validation', () => {
    test('Should return required missing fields', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({ body: { invalidProp: '' } })

      expect(result.statusCode).toBe(400)
      expect(result.body).toBe(
        'Required fields missing: name, address, birthDate, cpf, email, password'
      )
    })

    test('Should throw if addClient.add throws', async () => {
      const { sut, addClientMock } = makeSut()
      jest.spyOn(addClientMock, 'addClient').mockImplementationOnce(() => {
        throw new Error('Add throws')
      })
      jest.spyOn(addClientMock, 'fetchClients').mockResolvedValueOnce([])

      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(500)
      expect(result.body).toBe('Add throws')
    })
  })

  describe('Success', () => {
    test('Should return a client model', async () => {
      const { sut, addClientMock } = makeSut()
      jest.spyOn(addClientMock, 'fetchClients').mockResolvedValueOnce([])
      const result = await sut.handle(httpRequestMock)
      console.log(
        '🚀 ~ file: sign-up.controller.spec.ts:76 ~ test ~ result:',
        result
      )

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual(encodedTokenMock)
    })
  })
})
