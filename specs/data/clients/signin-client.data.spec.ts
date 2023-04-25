import { ClientData } from '@/data/services'
import { IEncrypt, IEncryptCompare, IIdGenerator } from '@/data/protocols/utils'
import { ClientModel } from '@/domain/models'
import { IClientsRepository } from '@/infra/postgres/protocols'
import { ClientDTO } from '@/presentation/dto'
import { IHashEncode } from '@/data/protocols/utils/hasher.protocol'
import { tokenEncodedMock } from '../../suport/mocks'

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
  addClient: (clientDto: ClientDTO) => Promise<ClientModel>
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>
  fetchClient: (idClient: string) => Promise<ClientModel>
  getClientByEmail: (email: string) => Promise<ClientModel>
  fetchClients: () => Promise<ClientModel[]>

  signin = (client: ClientModel, passwordHashed: string): Promise<string> => {
    return Promise.resolve('valid_token')
  }
}

class HasherMock implements IHashEncode {
  encode = (value: any): Promise<string> => {
    return Promise.resolve('valid_token')
  }
}
class EncrypterMock implements IEncrypt, IEncryptCompare {
  compare = (password: string, passwordHashed: string): Promise<boolean> => {
    return Promise.resolve(true)
  }
  encrypt = (payload: string): string => 'password_hashed'
}
class IdGeneratorMock implements IIdGenerator {
  generate: () => string
}

const makeSut = () => {
  const clientsRepositoryMock = new ClientsRepositoryMock()
  const hasherMock = new HasherMock()
  const encrypter = new EncrypterMock()
  const sut = new ClientData(
    clientsRepositoryMock,
    encrypter,
    new IdGeneratorMock(),
    hasherMock
  )

  return {
    hasherMock,
    encrypter,
    clientsRepositoryMock,
    sut,
  }
}

describe('ClientsData', () => {
  describe('Signin', () => {
    describe('Validation', () => {
      test('Should throw if encrypter.compare throws', async () => {
        const { sut, encrypter } = makeSut()
        jest.spyOn(encrypter, 'compare').mockImplementationOnce(() => {
          throw new Error()
        })
        const promise = sut.signin(clientModelMock, 'valid_password_hashed')

        await expect(promise).rejects.toThrow()
      })
      test('Should throw if hasher.hash throws', async () => {
        const { sut, hasherMock } = makeSut()
        jest.spyOn(hasherMock, 'encode').mockImplementationOnce(() => {
          throw new Error()
        })
        const promise = sut.signin(clientModelMock, 'valid_password_hashed')

        await expect(promise).rejects.toThrow()
      })
      test('Should returns null if password is invalid', async () => {
        const { sut, encrypter } = makeSut()
        jest.spyOn(encrypter, 'compare').mockReturnValueOnce(null)
        const result = await sut.signin(clientModelMock, 'password_hashed')

        expect(result).toBeNull()
      })
    })

    describe('Success', () => {
      test('Should return correct value hashed', async () => {
        const { sut } = makeSut()
        const result = await sut.signin(clientModelMock, 'password_hashed')

        expect(result).toEqual(tokenEncodedMock)
      })
    })
  })
})
