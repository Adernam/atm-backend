import { Token, TokenEncoded } from '@/presentation/protocols/token-header'

export const token: Token = {
  data: {
    idClient: 'idClient',
  },
}

export const tokenEncodedMock: TokenEncoded = {
  token: 'valid_token',
}
