import { Token } from './token-header'

export type HttpRequest = {
  body?: any
  params?: any
  query?: any
  token?: Token
}
export type HttpResponse = {
  statusCode: number
  body?: any
}
