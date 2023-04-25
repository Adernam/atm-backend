import { IUpdateOperation } from '@/domain/usecases/operations'
import {
  badRequest,
  notFoundRequest,
  successRequest,
} from '@/presentation/helpers/http.helper'
import {
  HttpRequest,
  HttpResponse,
  IController,
} from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'

export class UpdateOperationController implements IController {
  constructor(
    private readonly operationsData: IUpdateOperation,
    private readonly validations: Validation
  ) {}

  handle = async ({
    params,
    body,
    token: {
      data: { idClient },
    },
  }: HttpRequest): Promise<HttpResponse> => {
    try {
      const idOperation = params.id
      if (!idOperation) {
        return badRequest(new Error('Invalid operation id on path params.'))
      }

      const errors = await this.validations.handle(body)
      if (errors instanceof Error) {
        return badRequest(errors)
      }

      const result = await this.operationsData.updateOperation(idOperation, {
        ...body,
        idClient,
      })
      // TODO: move this validation to validation composite
      if (!result) {
        return notFoundRequest(new Error('Operation not found.'))
      }

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: 500,
        body: error.message,
      }
    }
  }
}
