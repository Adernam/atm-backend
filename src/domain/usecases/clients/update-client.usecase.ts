import { ClientModel } from '@/domain/models'
import { ClientDTO } from '@/presentation/dto'

export interface IUpdateClient {
  updateClient: (idClient: string, clientDto: ClientDTO) => Promise<ClientModel>
}
