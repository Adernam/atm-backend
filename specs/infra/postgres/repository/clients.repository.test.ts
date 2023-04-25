import { clientDto, clientModelMock } from '@/../specs/suport'
import { PostgresRepository } from '@/infra/postgres/config/data-souce'
import { ClientEntity } from '@/infra/postgres/entites'
import { ClientsRepository } from '@/infra/postgres/repository'

const sut = new ClientsRepository()

describe('ClientsRepository', () => {
  beforeAll(async () => {
    console.log(process.env.NODE_ENV)
    await PostgresRepository.initialize()
  })

  afterAll(async () => {
    await PostgresRepository.getRepository(ClientEntity).delete({})
    await PostgresRepository.destroy()
  })

  test('Should add client correctly', async () => {
    const result = await sut.addClient(clientModelMock)

    expect(result.address).toBe(clientModelMock.address)
    expect(result.name).toBe(clientModelMock.name)
    expect(result.password).toBeTruthy()
    expect(result.birthDate).toBe(clientModelMock.birthDate)
    expect(result.cpf).toBe(clientModelMock.cpf)
    expect(result.id).toBe(clientModelMock.id)
    expect(result.active).toBe(clientModelMock.active)
  })

  test('Should update client correctly', async () => {
    const result = await sut.updateClient(clientModelMock.id, clientDto)

    expect(result.address).toBe(clientDto.address)
    expect(result.name).toBe(clientDto.name)
    expect(result.password).toBeTruthy()
    expect(result.birthDate).toBe('2023-02-11')
    expect(result.cpf).toBe(clientModelMock.cpf)
    expect(result.id).toBe(clientModelMock.id)
    expect(result.active).toBe(clientModelMock.active)
  })

  test('Should get client by id correctly', async () => {
    const result = await sut.fetchClient(clientModelMock.id)

    expect(result.address).toBe(clientDto.address)
    expect(result.name).toBe(clientDto.name)
    expect(result.password).toBeTruthy()
    expect(result.birthDate).toBe('2023-02-11')
    expect(result.cpf).toBe(clientModelMock.cpf)
    expect(result.id).toBe(clientModelMock.id)
    expect(result.active).toBe(clientModelMock.active)
  })

  test('Should get clients correctly', async () => {
    const result = await sut.fetchClients({})

    expect(result.length).toBe(1)
    expect(result[0].name).toBe(clientDto.name)
    expect(result[0].password).toBeTruthy()
    expect(result[0].birthDate).toBe('2023-02-11')
    expect(result[0].cpf).toBe(clientModelMock.cpf)
    expect(result[0].id).toBe(clientModelMock.id)
    expect(result[0].active).toBe(clientModelMock.active)
  })
})
