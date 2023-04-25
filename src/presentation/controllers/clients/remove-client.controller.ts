import { IFetchClient, IRemoveClient } from '@/domain/usecases/clients'
import {
  badRequest,
  notFoundRequest,
  successRequest,
} from '@/presentation/helpers/http.helper'
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'

export class RemoveClientController implements IController {
  constructor(private readonly clientsData: IRemoveClient & IFetchClient) {}

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const idClient = request.params.id
      if (!idClient) {
        return badRequest(new Error('Invalid id client'))
      }

      const client = await this.clientsData.fetchClient(idClient)
      if (!client) {
        return notFoundRequest(new Error('Client not found'))
      }

      const result = await this.clientsData.removeClient(idClient)

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        body: error.message,
      }
    }
  }
}
