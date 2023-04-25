import { OperationDto, OperationModel } from '@/domain/models'
import { PostgresRepository } from '../config/data-souce'
import { OperationEntity } from '../entites'
import { IOperationRepository } from '../protocols'

export class OperationsRepository implements IOperationRepository {
  private readonly operationRepository =
    PostgresRepository.getRepository(OperationEntity)

  addOperation = async (
    operationDto: OperationModel
  ): Promise<OperationModel> => {
    await this.operationRepository.insert(operationDto)
    return this.operationRepository.findOne({ where: { id: operationDto.id } })
  }

  fetchOperation = async (idOperation: string): Promise<OperationModel> => {
    return this.operationRepository.findOne({ where: { id: idOperation } })
  }

  updateOperation = async (
    idOperation: string,
    operationDto: OperationDto
  ): Promise<OperationModel> => {
    await this.operationRepository.update(
      { id: idOperation },
      { ...operationDto }
    )
    return this.operationRepository.findOne({ where: { id: idOperation } })
  }

  fetchOperations = async (query: object): Promise<OperationModel[]> => {
    return this.operationRepository.find({
      where: { ...query },
      relations: ['client'],
    })
  }

  removeOperation = async (id: string): Promise<void> => {
    await this.operationRepository.delete({ id })
  }
}
