import { Estoque } from '../entities/estoque';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';

export interface EstoqueRepository {
  create(estoque: Estoque): Promise<void>;
  findById(id: UniqueEntityId): Promise<Estoque | null>;
  findByNome(nome: string): Promise<Estoque | null>;
  findAll(): Promise<Estoque[]>;
  update(estoque: Estoque): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
}
