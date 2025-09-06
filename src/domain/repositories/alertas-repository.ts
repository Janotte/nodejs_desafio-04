import { Alerta } from '../entities/alerta';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { StatusAlerta, TipoAlerta } from '../entities/alerta';

export interface AlertasRepository {
  create(alerta: Alerta): Promise<void>;
  findById(id: UniqueEntityId): Promise<Alerta | null>;
  findByStatus(status: StatusAlerta): Promise<Alerta[]>;
  findByTipo(tipo: TipoAlerta): Promise<Alerta[]>;
  findPendentes(): Promise<Alerta[]>;
  findByProdutoId(produtoId: UniqueEntityId): Promise<Alerta[]>;
  findAll(): Promise<Alerta[]>;
  update(alerta: Alerta): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
}
