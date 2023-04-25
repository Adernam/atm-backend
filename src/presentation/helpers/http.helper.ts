import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error.message,
  }
}

export const notFoundRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 404,
    body: error.message,
  }
}
export const unauthorized = (error: Error): HttpResponse => {
  return {
    statusCode: 401,
    body: error.message,
  }
}

export const successRequest = (body: any): HttpResponse => {
  return {
    statusCode: 200,
    body,
  }
}
