import { OrdemCompra, StatusOrdemCompra } from '../entities/ordem-compra';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';

export interface OrdensCompraRepository {
  create(ordem: OrdemCompra): Promise<void>;
  findById(id: UniqueEntityId): Promise<OrdemCompra | null>;
  findByStatus(status: StatusOrdemCompra): Promise<OrdemCompra[]>;
  findByFornecedorId(fornecedorId: UniqueEntityId): Promise<OrdemCompra[]>;
  findByProdutoId(produtoId: UniqueEntityId): Promise<OrdemCompra[]>;
  findPendentes(): Promise<OrdemCompra[]>;
  findAprovadas(): Promise<OrdemCompra[]>;
  findEnviadas(): Promise<OrdemCompra[]>;
  findRecebidas(): Promise<OrdemCompra[]>;
  findAll(): Promise<OrdemCompra[]>;
  update(ordem: OrdemCompra): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
}
