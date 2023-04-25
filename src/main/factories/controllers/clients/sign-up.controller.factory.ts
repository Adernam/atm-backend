import { SignUpController } from '@/presentation/controllers/clients'
import { IController } from '@/presentation/protocols'
import {
  ValidationCompose,
  ClientAlreadyExistsValidation,
  RequiredFieldsValidation,
} from '@/presentation/validations'
import { makeClientsData } from '../../data/clients.data.factory'

export const makeSignUpController = (): IController => {
  const clientData = makeClientsData()
  const validations = new ValidationCompose([
    new RequiredFieldsValidation([
      'name',
      'address',
      'birthDate',
      'cpf',
      'email',
      'password',
    ]),
    new ClientAlreadyExistsValidation(clientData),
  ])
  return new SignUpController(clientData, validations)
}
