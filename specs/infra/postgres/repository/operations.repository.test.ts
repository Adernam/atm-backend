import {
  ClientModel,
  OperationDto,
  OperationModel,
  OperationStatus,
  TypeNote,
} from '@/domain/models'
import { PostgresRepository } from '@/infra/postgres/config/data-souce'
import { ClientEntity, OperationEntity } from '@/infra/postgres/entites'
import { OperationsRepository } from '@/infra/postgres/repository/operations.repository'
import { randomUUID } from 'crypto'

const clientMock = {
  address: 'address',
  email: 'email',
  birthDate: '2023-02-11T12:57:47Z',
  cpf: 'cpf',
  name: 'name',
  password: 'password',
  id: randomUUID(),
  active: true,
  createdAt: '2023-02-11T12:57:47Z',
  updatedAt: '2023-02-11T12:57:47Z',
  deletedAt: '2023-02-11T12:57:47Z',
}
const operationModelMock = {
  amount: 1000,
  idClient: clientMock.id,
  status: OperationStatus.CREATED,
  createdAt: '2023-02-11T12:57:47Z',
  doneAt: null,
  reservedAt: null,
  id: randomUUID(),
  packages: [],
}
const operationUpdateMock = {
  amount: 1500,
  idClient: clientMock.id,
  status: OperationStatus.DONE,
  createdAt: '2023-02-11T12:57:47Z',
  doneAt: '2023-02-11T12:57:47Z',
  reservedAt: '2023-02-11T12:57:47Z',
  packages: [],
}

const sut = new OperationsRepository()

describe('OperationsRepository', () => {
  beforeAll(async () => {
    await PostgresRepository.initialize()
    await PostgresRepository.getRepository(ClientEntity).insert(clientMock)
  })

  afterAll(async () => {
    await PostgresRepository.getRepository(OperationEntity).delete({})
    await PostgresRepository.getRepository(ClientEntity).delete({})
    await PostgresRepository.destroy()
  })

  test('Should add operation correctly', async () => {
    const result = await sut.addOperation(
      operationModelMock as unknown as OperationModel
    )

    expect(result.amount).toBe(operationModelMock.amount)
    expect(result.createdAt).toStrictEqual(operationModelMock.createdAt)
    expect(result.doneAt).toBeNull()
    expect(result.id).toBe(operationModelMock.id)
    expect(result.idClient).toBe(operationModelMock.idClient)
    expect(result.reservedAt).toBeNull()
    expect(result.status).toBe(operationModelMock.status)
  })

  test('Should get operation correctly', async () => {
    const result = await sut.fetchOperation(operationModelMock.id)

    expect(result.amount).toBe(operationModelMock.amount)
    expect(result.createdAt).toStrictEqual(operationModelMock.createdAt)
    expect(result.doneAt).toBeNull()
    expect(result.id).toBe(operationModelMock.id)
    expect(result.idClient).toBe(operationModelMock.idClient)
    expect(result.reservedAt).toBeNull()
    expect(result.status).toBe(operationModelMock.status)
  })

  test('Should get operations correctly', async () => {
    const result = await sut.fetchOperations({})

    expect(result.length).toBe(1)
    expect(result[0].amount).toBe(operationModelMock.amount)
    expect(result[0].createdAt).toStrictEqual(operationModelMock.createdAt)
    expect(result[0].doneAt).toBeNull()
    expect(result[0].id).toBe(operationModelMock.id)
    expect(result[0].idClient).toBe(operationModelMock.idClient)
    expect(result[0].reservedAt).toBeNull()
    expect(result[0].status).toBe(operationModelMock.status)
  })

  test('Should update operation correctly', async () => {
    const result = await sut.updateOperation(
      operationModelMock.id,
      operationUpdateMock as unknown as OperationModel
    )

    expect(result.amount).toBe(operationUpdateMock.amount)
    expect(result.createdAt).toStrictEqual(new Date('2023-02-11T16:57:47.000Z'))
    expect(result.doneAt).toStrictEqual(new Date('2023-02-11T16:57:47.000Z'))
    expect(result.idClient).toBe(operationUpdateMock.idClient)
    expect(result.reservedAt).toStrictEqual(
      new Date('2023-02-11T16:57:47.000Z')
    )
    expect(result.status).toBe(operationUpdateMock.status)
  })
})
