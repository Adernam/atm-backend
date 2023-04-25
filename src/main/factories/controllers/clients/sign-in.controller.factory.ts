import { SignInController } from '@/presentation/controllers/clients/sign-in.controller'
import { IController } from '@/presentation/protocols'
import { RequiredFieldsValidation } from '@/presentation/validations/required-fields.validation'
import { ValidationCompose } from '@/presentation/validations/validation-compose.validation'
import { makeClientsData } from '../../data/clients.data.factory'

export const makeSigninController = (): IController => {
  const requiredFieldsValidation = new RequiredFieldsValidation([
    'email',
    'password',
  ])
  const validations = new ValidationCompose([requiredFieldsValidation])

  return new SignInController(makeClientsData(), validations)
}
