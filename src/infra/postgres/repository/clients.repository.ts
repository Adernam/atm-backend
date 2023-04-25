/* eslint-disable indent */
import { ClientModel } from '@/domain/models'
import { ClientDTO } from '@/presentation/dto'
import { PostgresRepository } from '../config/data-souce'
import { ClientEntity } from '../entites'
import { IClientsRepository } from '../protocols'

export class ClientsRepository implements IClientsRepository {
  private readonly clientsRepository =
    PostgresRepository.getRepository(ClientEntity)

  updateClient = async (
    idClient: string,
    fieldsToUpdate: ClientDTO
  ): Promise<ClientModel> => {
    await this.clientsRepository.update({ id: idClient }, { ...fieldsToUpdate })
    return this.clientsRepository.findOne({ where: { id: idClient } })
  }

  // TODO: remove sensitive informations
  fetchClient = async (id: string): Promise<ClientModel> => {
    return this.clientsRepository.findOne({
      where: { id },
    })
  }

  // TODO: remove sensitive informations
  fetchClients = async (query: any): Promise<ClientModel[]> => {
    return this.clientsRepository.find({ where: query })
  }

  addClient = async (client: ClientModel): Promise<ClientModel> => {
    return this.clientsRepository.save(client)
  }

  removeClient = async (id: string): Promise<void> => {
    await this.clientsRepository.delete(id)
  }
}
