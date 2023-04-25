import {
  IHashDecode,
  IHashEncode,
} from '@/data/protocols/utils/hasher.protocol'
import jwt from 'jsonwebtoken'
import ms from 'ms'

export class HasherAdapter implements IHashEncode, IHashDecode {
  constructor(
    private readonly tokenKey: string,
    private readonly expiresIn?: string
  ) { }

  encode = (value: any): Promise<string> => {
    try {
      const result = jwt.sign({ data: value }, this.tokenKey, {
        expiresIn: ms(this.expiresIn),
      })

      return Promise.resolve(result)
    } catch (error) {
      return null
    }
  }

  decode = (token: string): Promise<any> => {
    try {
      const tokenDecoded = jwt.verify(token, this.tokenKey)

      return Promise.resolve(tokenDecoded)
    } catch (error) {
      return null
    }
  }
}
