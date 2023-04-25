import { clientModelMock } from '@/../specs/suport'
import { IClientsData } from '@/data/protocols/services'
import { ClientModel } from '@/domain/models'
import { GetClientController } from '@/presentation/controllers/clients/get-client.controller'
import { ClientDTO } from '@/presentation/dto'
import { HttpRequest } from '@/presentation/protocols'
import { Token, TokenEncoded } from '@/presentation/protocols/token-header'

const httpRequestMock: HttpRequest = {
  body: clientModelMock,
  params: { id: 'valid_id' },
}

class ClientsData implements IClientsData {
  removeClient: (id: string) => Promise<void>
  signin: (client: ClientModel, password: string) => Promise<TokenEncoded>
  getClientByEmail: (email: string) => Promise<ClientModel>
  addClient: (clientDto: ClientDTO) => Promise<ClientModel>
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>
  fetchClients: () => Promise<ClientModel[]>

  fetchClient = async (idClient: string): Promise<ClientModel> => {
    return Promise.resolve(clientModelMock)
  }
}

const makeSut = () => {
  const clientsData = new ClientsData()
  const sut = new GetClientController(clientsData)

  return { sut, clientsData }
}

describe('GetClientController', () => {
  describe('Validation', () => {
    test('Should return invalid id client', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({ ...httpRequestMock, params: {} })

      expect(result.statusCode).toBe(400)
      expect(result.body).toBe('Invalid id client')
    })

    test('Should return status 500 if clientsData throws ', async () => {
      const { sut, clientsData } = makeSut()
      jest.spyOn(clientsData, 'fetchClient').mockImplementationOnce(() => {
        throw new Error()
      })
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(500)
    })

    test('Should return client not found', async () => {
      const { sut, clientsData } = makeSut()
      jest.spyOn(clientsData, 'fetchClient').mockResolvedValue(null)
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(404)
      expect(result.body).toBe('Client not found')
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
