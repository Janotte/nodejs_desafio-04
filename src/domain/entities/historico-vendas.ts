import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Preco } from '../value-objects/preco';
import { Quantidade } from '../value-objects/quantidade';

export interface HistoricoVendasProps {
  produtoId: UniqueEntityId;
  quantidadeVendida: Quantidade;
  precoUnitario: Preco;
  precoTotal: Preco;
  dataVenda: Date;
  clienteId?: UniqueEntityId;
  vendedorId?: UniqueEntityId;
  desconto?: Preco;
  observacoes?: string;
}

export class HistoricoVendas extends Entity<HistoricoVendasProps> {
  constructor(props: HistoricoVendasProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get produtoId(): UniqueEntityId {
    return this.props.produtoId;
  }

  get quantidadeVendida(): Quantidade {
    return this.props.quantidadeVendida;
  }

  get precoUnitario(): Preco {
    return this.props.precoUnitario;
  }

  get precoTotal(): Preco {
    return this.props.precoTotal;
  }

  get dataVenda(): Date {
    return this.props.dataVenda;
  }

  get clienteId(): UniqueEntityId | undefined {
    return this.props.clienteId;
  }

  get vendedorId(): UniqueEntityId | undefined {
    return this.props.vendedorId;
  }

  get desconto(): Preco | undefined {
    return this.props.desconto;
  }

  get observacoes(): string | undefined {
    return this.props.observacoes;
  }

  // Métodos de domínio
  calcularLucro(custoUnitario: Preco): Preco {
    const lucroUnitario = this.props.precoUnitario.valor - custoUnitario.valor;
    return new Preco(lucroUnitario * this.props.quantidadeVendida.valor);
  }

  calcularMargemLucro(custoUnitario: Preco): number {
    const lucroUnitario = this.props.precoUnitario.valor - custoUnitario.valor;
    return (lucroUnitario / this.props.precoUnitario.valor) * 100;
  }

  aplicarDesconto(desconto: Preco): void {
    this.props.desconto = desconto;
    this.props.precoTotal = new Preco(this.props.precoTotal.valor - desconto.valor);
  }

  adicionarObservacao(observacao: string): void {
    this.props.observacoes = observacao;
  }

  // Método para criar uma venda
  static create(
    produtoId: UniqueEntityId,
    quantidadeVendida: Quantidade,
    precoUnitario: Preco,
    clienteId?: UniqueEntityId,
    vendedorId?: UniqueEntityId,
    observacoes?: string
  ): HistoricoVendas {
    const precoTotal = precoUnitario.multiplicar(quantidadeVendida.valor);

    return new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal,
      dataVenda: new Date(),
      clienteId,
      vendedorId,
      observacoes,
    });
  }
}
