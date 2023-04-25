import { IFetchOperations } from '@/domain/usecases/operations/get-operations.usecase'
import { successRequest } from '@/presentation/helpers/http.helper'
import {
  HttpRequest,
  HttpResponse,
  IController,
} from '@/presentation/protocols'

export class GetOperationsController implements IController {
  constructor(private readonly operationsData: IFetchOperations) {}

  handle = async ({ query, token }: HttpRequest): Promise<HttpResponse> => {
    try {
      const {
        data: { idClient },
      } = token
      const result = await this.operationsData.fetchOperations({
        ...query,
        idClient,
      })

      return successRequest(result)
    } catch (error) {
      return {
        statusCode: 500,
        body: error.message,
      }
    }
  }
}
