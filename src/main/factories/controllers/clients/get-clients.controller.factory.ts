import { GetClientsController } from '@/presentation/controllers/clients/get-clients.controller'
import { IController } from '@/presentation/protocols'
import { makeClientsData } from '../../data/clients.data.factory'

export const makeGetClientsController = (): IController => {
  return new GetClientsController(makeClientsData())
}
