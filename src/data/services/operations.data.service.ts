import {
  OperationModel,
  OperationStatus,
  PackageModel,
  PackageStatus,
  OperationDto,
  PackageDto,
} from '@/domain/models'
import { IOperationRepository } from '@/infra/postgres/protocols'
import { IOperationData } from '../protocols/services'
import { IIdGenerator } from '../protocols/utils'

export class OperationData implements IOperationData {
  constructor(
    private readonly operationRepository: IOperationRepository,
    private readonly idGenerator: IIdGenerator
  ) {}

  private buildPackages = (packges: PackageDto[]): PackageModel[] => {
    return packges.map((pkg) => {
      const closedAt = pkg.quantityNote >= 50 ? new Date(Date.now()) : null
      const status = closedAt ? PackageStatus.CLOSED : PackageStatus.OPENED

      if (!pkg.createdAt) {
        return {
          id: this.idGenerator.generate(),
          quantityNote: pkg.quantityNote,
          typeNote: pkg.typeNote,
          openedAt: new Date(Date.now()),
          closedAt,
          status,
          createdAt: new Date(Date.now()),
          updatedAt: null,
        }
      }

      return {
        id: pkg.id,
        quantityNote: pkg.quantityNote,
        typeNote: pkg.typeNote,
        openedAt: pkg.openedAt,
        closedAt: pkg.closedAt,
        status: pkg.status,
        createdAt: pkg.createdAt,
        updatedAt: pkg.updatedAt,
      }
    })
  }

  private buildNewOperation = (operationDto: OperationDto): OperationModel => {
    const id = this.idGenerator.generate()

    return {
      id,
      idClient: operationDto.idClient,
      amount: operationDto.amount,
      status: OperationStatus.CREATED,
      createdAt: new Date(),
      reservedAt: null,
      doneAt: null,
      packages: this.buildPackages(operationDto.packages),
    }
  }

  addOperation = async (
    operationDto: OperationDto
  ): Promise<OperationModel> => {
    const newOperation = this.buildNewOperation(operationDto)
    return this.operationRepository.addOperation(newOperation)
  }

  fetchOperation = async (idOperation: string): Promise<OperationModel> => {
    return this.operationRepository.fetchOperation(idOperation)
  }

  updateOperation = async (
    idOperation: string,
    operationDto: OperationDto
  ): Promise<OperationModel> => {
    const packages = this.buildPackages(operationDto.packages)
    return this.operationRepository.updateOperation(idOperation, {
      ...operationDto,
      packages,
    })
  }

  fetchOperations = async (
    query: Record<string, any>
  ): Promise<OperationModel[]> => {
    return this.operationRepository.fetchOperations(query)
  }

  removeOperation = (id: string): Promise<void> => {
    return this.operationRepository.removeOperation(id)
  }
}
