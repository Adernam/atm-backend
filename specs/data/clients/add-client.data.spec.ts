import { ClientData } from '@/data/services'
import { IEncrypt, IEncryptCompare, IIdGenerator } from '@/data/protocols/utils'
import { ClientModel } from '@/domain/models'
import { IClientsRepository } from '@/infra/postgres/protocols'
import { ClientDTO } from '@/presentation/dto'
import { IHashEncode } from '@/data/protocols/utils/hasher.protocol'
import { tokenEncodedMock } from '../../suport/mocks'
import { clientModelMock } from '../../suport'

const clientDto: ClientDTO = {
  address: 'address',
  birthDate: '2023-02-11T12:57:47Z',
  cpf: 'cpf',
  name: 'name',
  password: 'password',
  active: true,
}

class ClientsRepositoryMock implements IClientsRepository {
  removeClient: (id: string) => Promise<void>
  getClientByEmail: (email: string) => Promise<ClientModel>
  fetchClients: () => Promise<ClientModel[]>
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>
  fetchClient: (idClient: string) => Promise<ClientModel>
  addClient(client: ClientDTO): Promise<ClientModel> {
    return Promise.resolve(clientModelMock)
  }
}
class HasherMock implements IHashEncode {
  encode = (value: any): Promise<string> => Promise.resolve('valid_token')
}
class EncrypterMock implements IEncrypt, IEncryptCompare {
  compare: (password: string, passwordHashed: string) => Promise<boolean>
  encrypt(payload: string): string {
    return payload + '_hashed'
  }
}
class IdGeneratorMock implements IIdGenerator {
  generate(): string {
    return 'idMocked'
  }
}

const makeSut = () => {
  const clientsRepositoryMock = new ClientsRepositoryMock()
  const encryptMock = new EncrypterMock()
  const idGeneratorMock = new IdGeneratorMock()
  const hasherMock = new HasherMock()
  const sut = new ClientData(
    clientsRepositoryMock,
    encryptMock,
    idGeneratorMock,
    hasherMock
  )

  return {
    clientsRepositoryMock,
    encryptMock,
    idGeneratorMock,
    hasherMock,
    sut,
  }
}

describe('ClientsData', () => {
  describe('addClient', () => {
    describe('Validation', () => {
      test('Should throw if encrypter throws', async () => {
        const { sut, encryptMock } = makeSut()
        jest.spyOn(encryptMock, 'encrypt').mockImplementationOnce(() => {
          throw new Error()
        })
        const promise = sut.addClient(clientDto)

        await expect(promise).rejects.toThrow()
      })

      test('Should throw if idGenerator throws', async () => {
        const { sut, idGeneratorMock } = makeSut()
        jest.spyOn(idGeneratorMock, 'generate').mockImplementationOnce(() => {
          throw new Error()
        })
        const promise = sut.addClient(clientDto)

        await expect(promise).rejects.toThrow()
      })

      test('Should throw if addRepository throws', async () => {
        const { sut, clientsRepositoryMock } = makeSut()
        jest
          .spyOn(clientsRepositoryMock, 'addClient')
          .mockImplementationOnce(() => {
            throw new Error()
          })
        const promise = sut.addClient(clientDto)

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Success', () => {
      test('AddClientData should return valid token', async () => {
        const { sut } = makeSut()
        const result = await sut.addClient(clientDto)

        expect(result).toEqual(tokenEncodedMock)
      })
    })
  })
})
