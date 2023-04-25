import { ClientModel } from '@/domain/models'

export interface IFetchClients {
  fetchClients: (query?: object) => Promise<ClientModel[]>
}
