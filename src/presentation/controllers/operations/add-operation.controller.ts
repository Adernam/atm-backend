import { OperationDto } from '@/domain/models'
import { IAddOperation } from '@/domain/usecases/operations'
import { badRequest, successRequest } from '@/presentation/helpers/http.helper'
import {
  HttpRequest,
  HttpResponse,
  IController,
} from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'
export class AddOperationController implements IController {
  constructor(
    private readonly operationsData: IAddOperation,
    private readonly validations: Validation
  ) {}

  handle = async ({ body, token }: HttpRequest): Promise<HttpResponse> => {
    try {
      const errors = await this.validations.handle(body)
      if (errors instanceof Error) {
        return badRequest(errors)
      }

      const newOperation: OperationDto = {
        amount: body.amount,
        idClient: token.data.idClient,
        packages: body.packages,
      }
      const result = await this.operationsData.addOperation(newOperation)

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: 500,
        body: error.message,
      }
    }
  }
}
