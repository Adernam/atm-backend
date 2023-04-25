import { ClientData } from '@/data/services'
import { EncryptAdapter } from '@/infra/adapters/bcrypt/bcrypt.adapter'
import { HasherAdapter } from '@/infra/adapters/hasher/hasher.adapter'
import { UuidAdapter } from '@/infra/adapters/uuid/uuid.adapter'
import { ClientsRepository } from '@/infra/postgres/repository'

export const makeClientsData = () => {
  const idGenerator = new UuidAdapter()

  const salt = 12
  const encrypter = new EncryptAdapter(salt)

  const addClientRepository = new ClientsRepository()

  const tokenKey = process.env.TOKEN_KEY
  const expiresTokenIn = process.env.EXPIRES_TOKEN_IN
  const hasher = new HasherAdapter(tokenKey, expiresTokenIn)

  return new ClientData(addClientRepository, encrypter, idGenerator, hasher)
}
