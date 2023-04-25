import { ClientData } from '@/data/services'
import { IEncrypt, IEncryptCompare, IIdGenerator } from '@/data/protocols/utils'
import { ClientModel } from '@/domain/models'
import { IClientsRepository } from '@/infra/postgres/protocols'
import { ClientDTO } from '@/presentation/dto'
import { IHashEncode } from '@/data/protocols/utils/hasher.protocol'
import { clientsModelMock } from '../../suport'

class ClientsRepositoryMock implements IClientsRepository {
  removeClient: (id: string) => Promise<void>
  getClientByEmail: (email: string) => Promise<ClientModel>
  fetchClient: (idClient: string) => Promise<ClientModel>
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>
  addClient: (client: ClientModel) => Promise<ClientModel>

  fetchClients = async (): Promise<ClientModel[]> =>
    Promise.resolve(clientsModelMock)
}
class EncrypterMock implements IEncrypt, IEncryptCompare {
  compare: (password: string, passwordHashed: string) => Promise<boolean>
  encrypt: (payload: string) => string
}
class IdGeneratorMock implements IIdGenerator {
  generate: () => string
}
class HasherMock implements IHashEncode {
  encode = (value: any): Promise<string> => Promise.resolve('value_hashed')
}

const makeSut = () => {
  const clientsRepositoryMock = new ClientsRepositoryMock()
  const hasherMock = new HasherMock()
  const sut = new ClientData(
    clientsRepositoryMock,
    new EncrypterMock(),
    new IdGeneratorMock(),
    hasherMock
  )

  return {
    clientsRepositoryMock,
    sut,
  }
}

describe('ClientsData', () => {
  describe('getClients', () => {
    describe('Validation', () => {
      test('Should throw if clientsRepository throws', async () => {
        const { sut, clientsRepositoryMock } = makeSut()
        jest
          .spyOn(clientsRepositoryMock, 'fetchClients')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.fetchClients({})

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Success', () => {
      test('getClients should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.fetchClients({})

        expect(result).toEqual(clientsModelMock)
      })
    })
  })
})
