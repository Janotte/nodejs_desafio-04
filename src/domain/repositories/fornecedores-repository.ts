import { Fornecedor } from '../entities/fornecedor';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';

export interface FornecedoresRepository {
  create(fornecedor: Fornecedor): Promise<void>;
  findById(id: UniqueEntityId): Promise<Fornecedor | null>;
  findByCnpj(cnpj: string): Promise<Fornecedor | null>;
  findByNome(nome: string): Promise<Fornecedor | null>;
  findAtivos(): Promise<Fornecedor[]>;
  findAll(): Promise<Fornecedor[]>;
  update(fornecedor: Fornecedor): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
}
