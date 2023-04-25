import { IFetchClient, IUpdateClient } from '@/domain/usecases/clients'
import { ClientDTO } from '@/presentation/dto'
import {
  notFoundRequest,
  successRequest,
} from '@/presentation/helpers/http.helper'
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'

export class UpdateClientController implements IController {
  constructor(private readonly clientsData: IUpdateClient & IFetchClient) {}
  //TODO: create validate body with validateCompose
  validateBody = (clientDto: ClientDTO) => {
    const possibleFields = [
      'name',
      'address',
      'birthDate',
      'cpf',
      'password',
      'active',
      'deletedAt',
    ]
    const fieldsToUpdate: ClientDTO = possibleFields.reduce((prev, curr) => {
      if (clientDto[curr] !== undefined) {
        prev[curr] = clientDto[curr]
      }
      return prev
    }, {})

    return fieldsToUpdate
  }

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const idClient = request.params.id
      const client = await this.clientsData.fetchClient(idClient)
      if (!client) {
        return notFoundRequest(new Error('Client not found'))
      }

      const clientDto: ClientDTO = {
        name: request.body.name,
        address: request.body.address,
        birthDate: request.body.birthDate,
        cpf: request.body.cpf,
        active: request.body.active,
        deletedAt: request.body.deletedAt,
      }
      const fieldsToUpdate = this.validateBody(clientDto)

      const result = await this.clientsData.updateClient(
        idClient,
        fieldsToUpdate
      )

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        body: error.message,
      }
    }
  }
}
