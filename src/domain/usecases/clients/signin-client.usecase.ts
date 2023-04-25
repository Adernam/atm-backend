import { ClientModel } from '@/domain/models'
import { TokenEncoded } from '@/presentation/protocols/token-header'

export interface ISigninClient {
  signin: (client: ClientModel, password: string) => Promise<TokenEncoded>
}
