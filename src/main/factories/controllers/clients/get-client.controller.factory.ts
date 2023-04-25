import { GetClientController } from '@/presentation/controllers/clients/get-client.controller'
import { IController } from '@/presentation/protocols'
import { makeClientsData } from '../../data/clients.data.factory'

export const makeGetClientController = (): IController => {
  return new GetClientController(makeClientsData())
}
