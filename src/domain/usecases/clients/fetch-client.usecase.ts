import { ClientModel } from '@/domain/models'

export interface IFetchClient {
  fetchClient: (id: string) => Promise<ClientModel>
}
