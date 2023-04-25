import { IEncrypt, IEncryptCompare } from '@/data/protocols/utils'
import { hashSync, genSaltSync, compare as bcryptCompare } from 'bcryptjs'

export class EncryptAdapter implements IEncrypt, IEncryptCompare {
  constructor(private readonly salt: number) {}

  compare = async (
    password: string,
    passwordHashed: string
  ): Promise<boolean> => {
    return bcryptCompare(password, passwordHashed)
  }

  encrypt = (plainText: string): string => {
    const rounds = Number(this.salt)
    const salt: string = genSaltSync(rounds)

    return hashSync(plainText, salt)
  }
}
