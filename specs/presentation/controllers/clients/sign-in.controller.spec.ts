import { clientsModelMock } from '@/../specs/suport'
import { token, tokenEncodedMock } from '@/../specs/suport/mocks'
import { ClientModel } from '@/domain/models'
import { IFetchClients } from '@/domain/usecases/clients'
import { ISigninClient } from '@/domain/usecases/clients/signin-client.usecase'
import { SignInController } from '@/presentation/controllers/clients/sign-in.controller'
import { HttpRequest } from '@/presentation/protocols'
import { RequiredFieldsValidation } from '@/presentation/validations/required-fields.validation'
import { ValidationCompose } from '@/presentation/validations/validation-compose.validation'

const httpRequestMock: HttpRequest = {
  body: {
    email: 'valid_email',
    password: 'valid_password',
  },
}

class ClientData implements ISigninClient, IFetchClients {
  fetchClients = (): Promise<ClientModel[]> => {
    return Promise.resolve(clientsModelMock)
  }
  signin(client: ClientModel, password: string) {
    return Promise.resolve(tokenEncodedMock)
  }
}

const makeSut = () => {
  const clientData = new ClientData()
  //TODO: get validation from main factory
  const requiredFieldsValidation = new RequiredFieldsValidation([
    'email',
    'password',
  ])
  const validations = new ValidationCompose([requiredFieldsValidation])
  const sut = new SignInController(clientData, validations)

  return { sut, clientData }
}

describe('SignInController', () => {
  describe('Validation', () => {
    test('Should return invalid body', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({})

      expect(result.statusCode).toBe(400)
      expect(result.body).toBe('Invalid body request')
    })

    test('Should return required missing fields', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({ body: { unknown: '' } })

      expect(result.statusCode).toBe(400)
      expect(result.body).toBe('Required fields missing: email, password')
    })

    test('Should throw if clientData.signin throws', async () => {
      const { sut, clientData } = makeSut()
      jest
        .spyOn(clientData, 'signin')
        .mockRejectedValueOnce(new Error('Signin throws'))
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(500)
      expect(result.body).toBe('Signin throws')
    })

    test('Should throw if clientData.fetchClients throws', async () => {
      const { sut, clientData } = makeSut()
      jest
        .spyOn(clientData, 'fetchClients')
        .mockRejectedValueOnce(new Error('fetchClients throws'))
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(500)
      expect(result.body).toBe('fetchClients throws')
    })

    test('Should return unauthorized if client is not found', async () => {
      const { sut, clientData } = makeSut()
      jest.spyOn(clientData, 'fetchClients').mockResolvedValueOnce([])
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(401)
      expect(result.body).toBe('Invalid email or password')
    })

    test('Should return unauthorized if signin returns null', async () => {
      const { sut, clientData } = makeSut()
      jest.spyOn(clientData, 'signin').mockResolvedValueOnce(null)
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(401)
      expect(result.body).toBe('Invalid email or password')
    })
  })

  describe('Success', () => {
    test('Should return a token', async () => {
      const { sut } = makeSut()
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual(tokenEncodedMock)
    })
  })
})
