import { HistoricoVendas } from '../entities/historico-vendas';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';

export interface HistoricoVendasRepository {
  create(venda: HistoricoVendas): Promise<void>;
  findById(id: UniqueEntityId): Promise<HistoricoVendas | null>;
  findByProdutoId(produtoId: UniqueEntityId): Promise<HistoricoVendas[]>;
  findByClienteId(clienteId: UniqueEntityId): Promise<HistoricoVendas[]>;
  findByPeriodo(dataInicio: Date, dataFim: Date): Promise<HistoricoVendas[]>;
  findByProdutoIdEPeriodo(
    produtoId: UniqueEntityId,
    dataInicio: Date,
    dataFim: Date
  ): Promise<HistoricoVendas[]>;
  findAll(): Promise<HistoricoVendas[]>;
  update(venda: HistoricoVendas): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
}
