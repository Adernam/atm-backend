import { OperationDto } from '@/domain/models'
import { IAddOperation, IFetchOperation } from '@/domain/usecases/operations'
import { IRemoveOperation } from '@/domain/usecases/operations/remove-operation.usecase'
import { badRequest, successRequest } from '@/presentation/helpers/http.helper'
import {
  HttpRequest,
  HttpResponse,
  IController,
} from '@/presentation/protocols'

export class RemoveOperationController implements IController {
  constructor(
    private readonly operationsData: IRemoveOperation & IFetchOperation
  ) {}

  handle = async ({ params: { id } }: HttpRequest): Promise<HttpResponse> => {
    try {
      if (!id) {
        return badRequest(new Error('Operation not found'))
      }
      const operation = await this.operationsData.fetchOperation(id)
      if (!operation) {
        return badRequest(new Error('Operation not found'))
      }

      const result = await this.operationsData.removeOperation(id)

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: 500,
        body: error.message,
      }
    }
  }
}
