/* eslint-disable indent */
import {
  OperationModel,
  OperationStatus,
  PackageModel,
  TypeNote,
} from '@/domain/models'
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ClientEntity } from './client.entity'

class ColumnNumericTransformer {
  to(data: number): number {
    return data
  }
  from(data: string): number {
    return parseFloat(data)
  }
}
@Entity({ name: 'operations' })
export class OperationEntity implements OperationModel {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number

  @Column({
    type: 'enum',
    enum: [
      OperationStatus.CREATED,
      OperationStatus.DONE,
      OperationStatus.RESERVED,
    ],
  })
  status: OperationStatus

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
  reservedAt: Date

  @Column({ nullable: true, name: 'done_at' })
  doneAt: Date

  @Column({ name: 'id_client' })
  idClient: string

  @ManyToOne(() => ClientEntity, (client) => client.id)
  @JoinColumn({ name: 'id_client' })
  client: ClientEntity

  @Column('jsonb', { default: [] })
  packages: Array<PackageModel>
}
