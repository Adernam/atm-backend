/* eslint-disable indent */
import { ClientModel } from '@/domain/models'
import {
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OperationEntity } from './operation.entity'

@Entity({ name: 'clients' })
@Unique(['cpf'])
export class ClientEntity implements ClientModel {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column()
  email: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 100 })
  address: string

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: string

  @Column({ length: 100 })
  password: string

  @Column({ length: 14 })
  cpf: string

  @Column()
  active: boolean

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  public updatedAt: Date

  @OneToMany(() => OperationEntity, (op) => op.id)
  operations: OperationEntity[]
}
