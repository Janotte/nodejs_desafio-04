import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Preco } from '../value-objects/preco';
import { Quantidade } from '../value-objects/quantidade';

export enum StatusOrdemCompra {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  ENVIADA = 'ENVIADA',
  RECEBIDA = 'RECEBIDA',
  CANCELADA = 'CANCELADA',
}

export interface ItemOrdemCompra {
  produtoId: UniqueEntityId;
  quantidade: Quantidade;
  precoUnitario: Preco;
  precoTotal: Preco;
}

export interface OrdemCompraProps {
  fornecedorId: UniqueEntityId;
  itens: ItemOrdemCompra[];
  status: StatusOrdemCompra;
  dataCriacao: Date;
  dataAprovacao?: Date;
  dataEnvio?: Date;
  dataRecebimento?: Date;
  observacoes?: string;
  valorTotal: Preco;
  ativo: boolean;
}

export class OrdemCompra extends Entity<OrdemCompraProps> {
  constructor(props: OrdemCompraProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get fornecedorId(): UniqueEntityId {
    return this.props.fornecedorId;
  }

  get itens(): ItemOrdemCompra[] {
    return this.props.itens;
  }

  get status(): StatusOrdemCompra {
    return this.props.status;
  }

  get dataCriacao(): Date {
    return this.props.dataCriacao;
  }

  get dataAprovacao(): Date | undefined {
    return this.props.dataAprovacao;
  }

  get dataEnvio(): Date | undefined {
    return this.props.dataEnvio;
  }

  get dataRecebimento(): Date | undefined {
    return this.props.dataRecebimento;
  }

  get observacoes(): string | undefined {
    return this.props.observacoes;
  }

  get valorTotal(): Preco {
    return this.props.valorTotal;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  // Métodos de domínio
  aprovar(): void {
    if (this.props.status !== StatusOrdemCompra.PENDENTE) {
      throw new Error('Apenas ordens pendentes podem ser aprovadas');
    }

    this.props.status = StatusOrdemCompra.APROVADA;
    this.props.dataAprovacao = new Date();
  }

  enviar(): void {
    if (this.props.status !== StatusOrdemCompra.APROVADA) {
      throw new Error('Apenas ordens aprovadas podem ser enviadas');
    }

    this.props.status = StatusOrdemCompra.ENVIADA;
    this.props.dataEnvio = new Date();
  }

  receber(): void {
    if (this.props.status !== StatusOrdemCompra.ENVIADA) {
      throw new Error('Apenas ordens enviadas podem ser recebidas');
    }

    this.props.status = StatusOrdemCompra.RECEBIDA;
    this.props.dataRecebimento = new Date();
  }

  cancelar(): void {
    if (this.props.status === StatusOrdemCompra.RECEBIDA) {
      throw new Error('Ordens já recebidas não podem ser canceladas');
    }

    this.props.status = StatusOrdemCompra.CANCELADA;
  }

  adicionarItem(produtoId: UniqueEntityId, quantidade: Quantidade, precoUnitario: Preco): void {
    if (this.props.status !== StatusOrdemCompra.PENDENTE) {
      throw new Error('Apenas ordens pendentes podem ter itens adicionados');
    }

    const precoTotal = precoUnitario.multiplicar(quantidade.valor);
    const novoItem: ItemOrdemCompra = {
      produtoId,
      quantidade,
      precoUnitario,
      precoTotal,
    };

    this.props.itens.push(novoItem);
    this.recalcularValorTotal();
  }

  removerItem(produtoId: UniqueEntityId): void {
    if (this.props.status !== StatusOrdemCompra.PENDENTE) {
      throw new Error('Apenas ordens pendentes podem ter itens removidos');
    }

    this.props.itens = this.props.itens.filter(item => !item.produtoId.equals(produtoId));
    this.recalcularValorTotal();
  }

  atualizarQuantidadeItem(produtoId: UniqueEntityId, novaQuantidade: Quantidade): void {
    if (this.props.status !== StatusOrdemCompra.PENDENTE) {
      throw new Error('Apenas ordens pendentes podem ter quantidades alteradas');
    }

    const item = this.props.itens.find(item => item.produtoId.equals(produtoId));
    if (item) {
      item.quantidade = novaQuantidade;
      item.precoTotal = item.precoUnitario.multiplicar(novaQuantidade.valor);
      this.recalcularValorTotal();
    }
  }

  adicionarObservacao(observacao: string): void {
    this.props.observacoes = observacao;
  }

  obterItensPorProduto(produtoId: UniqueEntityId): ItemOrdemCompra | undefined {
    return this.props.itens.find(item => item.produtoId.equals(produtoId));
  }

  calcularDiasDesdeCriacao(): number {
    const agora = new Date();
    const diferenca = agora.getTime() - this.props.dataCriacao.getTime();
    return Math.floor(diferenca / (1000 * 60 * 60 * 24));
  }

  ativar(): void {
    this.props.ativo = true;
  }

  desativar(): void {
    this.props.ativo = false;
  }

  private recalcularValorTotal(): void {
    const total = this.props.itens.reduce((soma, item) => {
      return soma + item.precoTotal.valor;
    }, 0);

    this.props.valorTotal = new Preco(total);
  }

  // Método para criar uma ordem de compra
  static create(fornecedorId: UniqueEntityId, observacoes?: string): OrdemCompra {
    return new OrdemCompra({
      fornecedorId,
      itens: [],
      status: StatusOrdemCompra.PENDENTE,
      dataCriacao: new Date(),
      observacoes,
      valorTotal: new Preco(0),
      ativo: true,
    });
  }
}
