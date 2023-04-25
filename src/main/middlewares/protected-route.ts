import { Request, Response, NextFunction } from 'express'
import { HasherAdapter } from '@/infra/adapters/hasher/hasher.adapter'
import { Token } from '@/presentation/protocols/token-header'

export interface CustomRequest extends Request {
  token: Token
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers?.token as string
  const messageErrorUnauthorized = {
    error: 'Unauthorized',
  }

  if (!tokenHeader) {
    return res.status(401).json(messageErrorUnauthorized)
  }

  const tokenKey = process.env.TOKEN_KEY
  const hasher = new HasherAdapter(tokenKey)

  const tokenData: Token = await hasher.decode(tokenHeader)
  if (!tokenData) {
    return res.status(401).json(messageErrorUnauthorized)
  }

  ;(req as CustomRequest).token = tokenData
  next()
}
