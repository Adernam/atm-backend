import { ClientModel } from '@/domain/models/client.model'
import { ClientDTO } from '@/presentation/dto/client.dto'
import { Token, TokenEncoded } from '@/presentation/protocols/token-header'

export interface IAddClient {
  addClient: (clientDto: ClientDTO) => Promise<ClientModel | TokenEncoded>
}
