import { DataSource } from 'typeorm'
import { ClientEntity, OperationEntity } from '../entites'

const dbName: string = process.env.NODE_ENV === 'prod' ? 'atm' : 'atm_specs'
const port: number = process.env.NODE_ENV === 'prod' ? 5432 : 5433
const host: string = process.env.NODE_ENV === 'prod' ? 'db' : 'localhost'

export const PostgresRepository = new DataSource({
  type: 'postgres',
  host,
  port,
  username: 'postgres',
  password: 'postgres',
  database: dbName,
  synchronize: true,
  logging: true,
  entities: [ClientEntity, OperationEntity],
  subscribers: [],
  migrations: [],
})
