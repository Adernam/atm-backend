import { clientDto, clientModelMock } from '@/../specs/suport'
import { ClientModel } from '@/domain/models'
import { IFetchClient, IUpdateClient } from '@/domain/usecases/clients'
import { UpdateClientController } from '@/presentation/controllers/clients/update-client.controller'
import { ClientDTO } from '@/presentation/dto'
import { HttpRequest } from '@/presentation/protocols'
import { Token } from '@/presentation/protocols/token-header'

const token: Token = {
  data: { idClient: 'id_client' },
}
const httpRequestMock: HttpRequest = {
  body: clientDto,
  params: { id: 'uuid' },
  token,
}

class ClientsData implements IUpdateClient, IFetchClient {
  updateClient(idClient: string, clientDto: ClientDTO): Promise<ClientModel> {
    return Promise.resolve(clientModelMock)
  }
  fetchClient(idClient: string): Promise<ClientModel> {
    return Promise.resolve(clientModelMock)
  }
}

const makeSut = () => {
  const clientsData = new ClientsData()
  const sut = new UpdateClientController(clientsData)

  return { sut, clientsData }
}

describe('UpdateClientController', () => {
  describe('Validation', () => {
    test('Should only return necessary fields on validateBody', async () => {
      const { sut } = makeSut()
      const result = sut.validateBody({
        address: 'address_renamed',
        name: 'name_renamed',
        password: 'password_renamed',
        birthDate: undefined,
        cpf: undefined,
      })

      expect(result).toEqual({
        address: 'address_renamed',
        name: 'name_renamed',
        password: 'password_renamed',
      })
    })

    test('Should return notFound if client is not found', async () => {
      const { sut, clientsData } = makeSut()
      jest.spyOn(clientsData, 'fetchClient').mockResolvedValue(null)
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(404)
      expect(result.body).toBe('Client not found')
    })

    test('Should throw if clientsData.updateClient throws', async () => {
      const { sut, clientsData } = makeSut()
      jest
        .spyOn(clientsData, 'updateClient')
        .mockRejectedValue(new Error('clientsData throws'))
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(500)
      expect(result.body).toBe('clientsData throws')
    })
  })

  describe('Success', () => {
    test('Should return a client model', async () => {
      const { sut } = makeSut()
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual(clientModelMock)
    })
  })
})
