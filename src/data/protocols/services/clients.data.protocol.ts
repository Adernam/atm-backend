import {
  IAddClient,
  IUpdateClient,
  IFetchClient,
  IFetchClients,
  ISigninClient,
  IRemoveClient,
} from '@/domain/usecases/clients'

export interface IClientsData
  extends IAddClient,
    IUpdateClient,
    IFetchClient,
    IFetchClients,
    ISigninClient,
    IRemoveClient {}
