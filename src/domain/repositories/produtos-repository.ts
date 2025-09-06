import { Produto } from '../entities/produto';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';

export interface ProdutosRepository {
  create(produto: Produto): Promise<void>;
  findById(id: UniqueEntityId): Promise<Produto | null>;
  findByNome(nome: string): Promise<Produto | null>;
  findByCategoria(categoria: string): Promise<Produto[]>;
  findComEstoqueBaixo(): Promise<Produto[]>;
  findSemEstoque(): Promise<Produto[]>;
  findAtivos(): Promise<Produto[]>;
  findAll(): Promise<Produto[]>;
  update(produto: Produto): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
}
