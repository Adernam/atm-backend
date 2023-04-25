import { IIdGenerator } from '@/data/protocols/utils'
import { randomUUID } from 'crypto'

export class UuidAdapter implements IIdGenerator {
  public generate(): string {
    return randomUUID()
  }
}
