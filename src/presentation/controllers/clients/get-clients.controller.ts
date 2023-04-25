import { IFetchClients } from '@/domain/usecases/clients'
import { successRequest } from '@/presentation/helpers/http.helper'
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'

export class GetClientsController implements IController {
  constructor(private readonly clientsData: IFetchClients) {}

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const clients = await this.clientsData.fetchClients(request.query)
      return successRequest(clients)
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        body: error.message,
      }
    }
  }
}
