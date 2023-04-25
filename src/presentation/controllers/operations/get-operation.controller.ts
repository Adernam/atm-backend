import { IFetchOperation } from '@/domain/usecases/operations'
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

export class GetOperationController implements IController {
  constructor(private readonly operationsData: IFetchOperation) {}

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const idOperation = request.params.id
      if (!idOperation) {
        return badRequest(new Error('Invalid operation id on path params'))
      }

      const result = await this.operationsData.fetchOperation(idOperation)
      if (!result) {
        return notFoundRequest(new Error('Operation not found'))
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
