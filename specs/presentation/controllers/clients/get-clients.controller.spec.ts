import { clientsModelMock } from '@/../specs/suport'
import { IClientsData } from '@/data/protocols/services'
import { ClientModel } from '@/domain/models'
import { GetClientsController } from '@/presentation/controllers/clients'
import { ClientDTO } from '@/presentation/dto'
import { HttpRequest } from '@/presentation/protocols'
import { TokenEncoded } from '@/presentation/protocols/token-header'

const httpRequestMock: HttpRequest = {}

class ClientsData implements IClientsData {
  removeClient: (id: string) => Promise<void>
  signin: (client: ClientModel, password: string) => Promise<TokenEncoded>
  getClientByEmail: (email: string) => Promise<ClientModel>
  fetchClient: (idClient: string) => Promise<ClientModel>
  addClient: (clientDto: ClientDTO) => Promise<ClientModel>
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>

  fetchClients = async (): Promise<ClientModel[]> =>
    Promise.resolve(clientsModelMock)
}

const makeSut = () => {
  const clientsData = new ClientsData()
  const sut = new GetClientsController(clientsData)

  return { sut, clientsData }
}

describe('GetClientController', () => {
  describe('Validation', () => {
    test('Should return status 500 if clientsData throws ', async () => {
      const { sut, clientsData } = makeSut()
      jest.spyOn(clientsData, 'fetchClients').mockImplementationOnce(() => {
        throw new Error()
      })
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(500)
    })
  })

  describe('Success', () => {
    test('Should return a clients models', async () => {
      const { sut } = makeSut()
      const result = await sut.handle(httpRequestMock)

      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual(clientsModelMock)
    })
  })
})
