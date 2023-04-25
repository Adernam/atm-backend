import { IFetchClients } from '@/domain/usecases/clients'
import { ISigninClient } from '@/domain/usecases/clients/signin-client.usecase'
import { SigninDTO } from '@/presentation/dto'
import {
  badRequest,
  successRequest,
  unauthorized,
} from '@/presentation/helpers/http.helper'
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'
export class SignInController implements IController {
  constructor(
    private readonly clientData: ISigninClient & IFetchClients,
    private readonly validations: Validation
  ) {}

  handle = async ({ body }: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = await this.validations.handle(body)
      if (error instanceof Error) {
        return badRequest(error)
      }

      const clientDto: SigninDTO = {
        email: body.email,
        password: body.password,
      }

      const [client] = await this.clientData.fetchClients({
        email: clientDto.email,
      })
      if (!client) {
        return unauthorized(new Error('Invalid email or password'))
      }

      const result = await this.clientData.signin(client, clientDto.password)
      if (!result) {
        return unauthorized(new Error('Invalid email or password'))
      }

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        body: error.message,
      }
    }
  }
}
