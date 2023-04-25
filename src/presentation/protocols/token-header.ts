export type Token = {
  data: {
    idClient: string
  }
  exp?: number
  iat?: number
}

export type TokenEncoded = {
  token: string
}
