import { ClientData } from '@/data/services'
import { IEncrypt, IEncryptCompare, IIdGenerator } from '@/data/protocols/utils'
import { ClientModel } from '@/domain/models'
import { IClientsRepository } from '@/infra/postgres/protocols'
import { ClientDTO } from '@/presentation/dto'
import { IHashEncode } from '@/data/protocols/utils/hasher.protocol'
import { clientModelMock } from '../../suport'

const clientDto: ClientDTO = {
  address: 'address_renamed',
  name: 'name_renamed',
  password: 'password_renamed',
}

class ClientsRepositoryMock implements IClientsRepository {
  removeClient: (id: string) => Promise<void>
  getClientByEmail: (email: string) => Promise<ClientModel>
  fetchClients: () => Promise<ClientModel[]>
  fetchClient: (idClient: string) => Promise<ClientModel>
  addClient: (client: ClientModel) => Promise<ClientModel>

  updateClient = async (
    idClient: string,
    clientDto: ClientDTO
  ): Promise<ClientModel> => Promise.resolve(clientModelMock)
}
class EncrypterMock implements IEncrypt, IEncryptCompare {
  compare: (password: string, passwordHashed: string) => Promise<boolean>
  encrypt = (payload: string): string => `${payload}_hashed`
}
class IdGeneratorMock implements IIdGenerator {
  generate: () => string
}
class HasherMock implements IHashEncode {
  encode = async (payload: string): Promise<string> =>
    Promise.resolve(`${payload}_hashed`)
}

const makeSut = () => {
  const clientsRepositoryMock = new ClientsRepositoryMock()
  const encryptMock = new EncrypterMock()
  const hasherMock = new HasherMock()
  const sut = new ClientData(
    clientsRepositoryMock,
    encryptMock,
    new IdGeneratorMock(),
    hasherMock
  )

  return {
    clientsRepositoryMock,
    encryptMock,
    sut,
  }
}

describe('ClientsData', () => {
  describe('updateClient', () => {
    describe('Validation', () => {
      test('Should throw if clientsRepository throws', async () => {
        const { sut, clientsRepositoryMock } = makeSut()
        jest
          .spyOn(clientsRepositoryMock, 'updateClient')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.updateClient('any_id', clientDto)

        await expect(promise).rejects.toThrow()
      })

      test('Should throw if encrypter throws', async () => {
        const { sut, encryptMock } = makeSut()
        jest.spyOn(encryptMock, 'encrypt').mockImplementationOnce(() => {
          throw new Error()
        })
        const promise = sut.addClient(clientDto)

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Success', () => {
      test('updateClient should return correct values', async () => {
        const { sut } = makeSut()
        const result = await sut.updateClient('any_id', clientDto)

        expect(result).toEqual(clientModelMock)
      })
    })
  })
})
