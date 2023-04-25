import { ClientModel } from '@/domain/models'
import { ClientDTO } from '@/presentation/dto'
import { randomUUID } from 'crypto'

export const clientDto: ClientDTO = {
  address: 'address_renamed',
  name: 'name_renamed',
  password: 'password_renamed',
}

export const clientModelMock: ClientModel = {
  address: 'address',
  name: 'name',
  email: 'email',
  password: 'password',
  birthDate: '2023-02-11T12:57:47Z',
  cpf: '12312312312',
  id: randomUUID(),
  active: true,
  updatedAt: new Date('2023-02-11T12:57:47Z'),
  createdAt: new Date('2023-02-11T12:57:47Z'),
}

export const clientsModelMock: ClientModel[] = [
  {
    address: 'address',
    birthDate: '2023-02-11T12:57:47Z',
    cpf: '123.123.123-12',
    id: 'any_id',
    name: 'admin',
    email: 'email',
    password: 'pass',
    active: true,
    updatedAt: new Date('2023-02-11T12:57:47Z'),
    createdAt: new Date('2023-02-11T12:57:47Z'),
  },
  {
    address: 'address_2',
    birthDate: '1999-02-11T12:57:47Z',
    cpf: '000.000.000-00',
    id: 'any_id_2',
    name: 'admin_2',
    email: 'email_2',
    password: 'pass_2',
    active: true,
    updatedAt: new Date('2023-02-11T12:57:47Z'),
    createdAt: new Date('2023-02-11T12:57:47Z'),
  },
]
