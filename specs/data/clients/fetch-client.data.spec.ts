import { ClientData } from '@/data/services'
import { IEncrypt, IEncryptCompare, IIdGenerator } from '@/data/protocols/utils'
import { ClientModel } from '@/domain/models'
import { IClientsRepository } from '@/infra/postgres/protocols'
import { ClientDTO } from '@/presentation/dto'
import { IHashEncode } from '@/data/protocols/utils/hasher.protocol'
import { clientsModelMock } from '../../suport'

const clientModelMock: ClientModel = {
  address: 'address',
  email: 'email',
  birthDate: '2023-02-11T12:57:47Z',
  cpf: 'cpf',
  name: 'name',
  password: 'password',
  id: 'id',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

class ClientsRepositoryMock implements IClientsRepository {
  removeClient: (id: string) => Promise<void>
  signin(client: ClientModel, passwordHashed: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  fetchClients = (): Promise<ClientModel[]> => {
    return Promise.resolve(clientsModelMock)
  }
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>
  addClient: (client: ClientModel) => Promise<ClientModel>

  fetchClient = async (idClient: string): Promise<ClientModel> =>
    Promise.resolve(clientModelMock)
}

class HasherMock implements IHashEncode {
  encode: (value: any) => Promise<string>
}
class EncrypterMock implements IEncrypt, IEncryptCompare {
  compare: (password: string, passwordHashed: string) => Promise<boolean>
  encrypt: (payload: string) => string
}
class IdGeneratorMock implements IIdGenerator {
  generate: () => string
}

const makeSut = () => {
  const clientsRepositoryMock = new ClientsRepositoryMock()

  const sut = new ClientData(
    clientsRepositoryMock,
    new EncrypterMock(),
    new IdGeneratorMock(),
    new HasherMock()
  )

  return {
    clientsRepositoryMock,
    sut,
  }
}

describe('ClientsData', () => {
  describe('getClient', () => {
    describe('Validation', () => {
      test('Should throw if clientsRepository throws', async () => {
        const { sut, clientsRepositoryMock } = makeSut()
        jest
          .spyOn(clientsRepositoryMock, 'fetchClient')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.fetchClient('any_id')

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Success', () => {
      test('getClient should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.fetchClient('any_id')

        expect(result).toEqual(clientModelMock)
      })
    })
  })
})
