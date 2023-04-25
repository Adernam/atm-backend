import { Validation } from '@/presentation/protocols/validation'
import { BadRequestError } from '../errors'
import { IFetchClients } from '@/domain/usecases/clients'

export class ClientAlreadyExistsValidation implements Validation {
  constructor(private readonly clientData: IFetchClients) {}

  handle = async (body: any): Promise<void | Error> => {
    const client = await this.clientData.fetchClients([
      { email: body.email },
      { cpf: body.cpf },
    ])

    if (client.length) {
      return Promise.resolve(new BadRequestError('This client already exists'))
    }
  }
}
