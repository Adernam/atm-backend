import { IEncrypt, IEncryptCompare, IIdGenerator } from '@/data/protocols/utils'
import { ClientModel } from '@/domain/models'
import { IClientsRepository } from '@/infra/postgres/protocols'
import { ClientDTO } from '@/presentation/dto'
import { Token, TokenEncoded } from '@/presentation/protocols/token-header'
import { IClientsData } from '../protocols/services/clients.data.protocol'
import { IHashEncode } from '../protocols/utils/hasher.protocol'

export class ClientData implements IClientsData {
  constructor(
    private readonly clientsRepository: IClientsRepository,
    private readonly encrypter: IEncrypt & IEncryptCompare,
    private readonly idGenerator: IIdGenerator,
    private readonly hasher: IHashEncode
  ) {}

  private buildNewClient = (clientDto: ClientDTO): ClientModel => {
    const id = this.idGenerator.generate()
    const passwordHashed = this.encrypter.encrypt(clientDto.password)

    return {
      id,
      email: clientDto.email,
      name: clientDto.name,
      address: clientDto.address,
      birthDate: clientDto.birthDate,
      cpf: clientDto.cpf,
      password: passwordHashed,
      active: true,
      createdAt: new Date(),
      updatedAt: null,
    }
  }

  addClient = async (clientDto: ClientDTO): Promise<TokenEncoded> => {
    const newClient = this.buildNewClient(clientDto)
    const client = (await this.clientsRepository.addClient(
      newClient
    )) as ClientModel
    const token = {
      idClient: client.id,
    }
    const tokenEncoded = await this.hasher.encode(token)

    return { token: tokenEncoded }
  }

  fetchClient = async (idClient: string): Promise<ClientModel> => {
    return this.clientsRepository.fetchClient(idClient)
  }

  fetchClients = async (query: any): Promise<ClientModel[]> => {
    return this.clientsRepository.fetchClients(query)
  }

  updateClient = async (
    idClient: string,
    clientDto: ClientDTO
  ): Promise<ClientModel> => {
    if (clientDto.password) {
      clientDto.password = this.encrypter.encrypt(clientDto.password)
    }

    return this.clientsRepository.updateClient(idClient, clientDto)
  }

  signin = async (
    client: ClientModel,
    password: string
  ): Promise<TokenEncoded> => {
    const passwordIsValid = await this.encrypter.compare(
      password,
      client.password
    )
    if (!passwordIsValid) {
      return null
    }

    const token = {
      idClient: client.id,
    }
    const tokenEncoded = await this.hasher.encode(token)

    return { token: tokenEncoded }
  }

  removeClient = (id: string): Promise<void> => {
    return this.clientsRepository.removeClient(id)
  }
}
