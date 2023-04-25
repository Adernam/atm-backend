import { IController, HttpRequest } from '@/presentation/protocols'
import { RequestHandler, Request, Response } from 'express'
import { CustomRequest } from '../middlewares/protected-route'

export const adaptRoute = (controller: IController): RequestHandler => {
  return async (req: Request, res: Response) => {
    try {
      const { body, query, params } = req
      const httpRequest: HttpRequest = {
        body,
        params,
        query,
        token: (req as CustomRequest).token,
      }

      const httpResponse = await controller.handle(httpRequest)
      let bodyResponse: { error?: object } = {}

      if (httpResponse.statusCode >= 400) {
        bodyResponse.error = httpResponse.body
      } else {
        bodyResponse = httpResponse.body
      }

      return res.status(httpResponse.statusCode).json(bodyResponse)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
