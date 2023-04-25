export enum PackageStatus {
  NEW = 'NEW',
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
}

export enum TypeNote {
  $10 = 10,
  $50 = 50,
  $100 = 100,
}

export type PackageModel = {
  id: string
  quantityNote: number
  typeNote: TypeNote
  status: PackageStatus
  openedAt: Date
  closedAt: Date
  createdAt: Date
  updatedAt: Date
}

export type PackageDto = {
  quantityNote: number
  typeNote: TypeNote
  id?: string
  status?: PackageStatus
  openedAt?: Date
  closedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export enum OperationStatus {
  CREATED = 'CREATED',
  RESERVED = 'RESERVED',
  DONE = 'DONE',
}

export type OperationDto = {
  amount: number
  status?: OperationStatus
  createdAt?: Date
  reservedAt?: Date
  doneAt?: Date
  packages: PackageDto[]
  idClient: string
}

export type OperationModel = {
  id: string
  amount: number
  status: OperationStatus
  createdAt: Date
  reservedAt: Date
  doneAt: Date
  idClient: string
  packages: PackageModel[]
}
