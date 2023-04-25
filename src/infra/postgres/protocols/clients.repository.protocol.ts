import {
  IAddClient,
  IUpdateClient,
  IFetchClient,
  IFetchClients,
  IRemoveClient,
} from '@/domain/usecases/clients'

export interface IClientsRepository
  extends IAddClient,
    IUpdateClient,
    IFetchClient,
    IFetchClients,
    IRemoveClient {}
