import { UpdateClientController } from '@/presentation/controllers/clients/update-client.controller'
import { IController } from '@/presentation/protocols'
import { makeClientsData } from '../../data/clients.data.factory'

export const makeUpdateClientController = (): IController => {
  return new UpdateClientController(makeClientsData())
}
