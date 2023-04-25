import { IController } from '@/presentation/protocols'
import { makeClientsData } from '../../data/clients.data.factory'
import { RemoveClientController } from '@/presentation/controllers/clients/remove-client.controller'

export const makeRemoveClientController = (): IController => {
  return new RemoveClientController(makeClientsData())
}
