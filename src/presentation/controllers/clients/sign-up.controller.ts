import { IAddClient } from '@/domain/usecases/clients'
import { ClientDTO } from '@/presentation/dto'
import { BadRequestError } from '@/presentation/errors'
import { badRequest, successRequest } from '@/presentation/helpers/http.helper'
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'

export class SignUpController implements IController {
  constructor(
    private readonly addClient: IAddClient,
    private readonly validations: Validation
  ) {}

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const errors = await this.validations.handle(request.body)
      if (errors instanceof Error) {
        return badRequest(errors)
      }

      const clientDto: ClientDTO = {
        name: request.body.name,
        address: request.body.address,
        birthDate: request.body.birthDate,
        cpf: request.body.cpf,
        password: request.body.password,
        email: request.body.email,
      }

      const result = await this.addClient.addClient(clientDto)

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        body: error.message,
      }
    }
  }
}
