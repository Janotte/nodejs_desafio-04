import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Preco } from '../value-objects/preco';
import { Quantidade } from '../value-objects/quantidade';

export interface ProdutoProps {
  nome: string;
  cor: string;
  tamanho: string;
  preco: Preco;
  quantidade: Quantidade;
  quantidadeMinima: Quantidade;
  descricao?: string;
  categoria?: string;
  ativo: boolean;
}

export class Produto extends Entity<ProdutoProps> {
  constructor(props: ProdutoProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get nome(): string {
    return this.props.nome;
  }

  get cor(): string {
    return this.props.cor;
  }

  get tamanho(): string {
    return this.props.tamanho;
  }

  get preco(): Preco {
    return this.props.preco;
  }

  get quantidade(): Quantidade {
    return this.props.quantidade;
  }

  get quantidadeMinima(): Quantidade {
    return this.props.quantidadeMinima;
  }

  get descricao(): string | undefined {
    return this.props.descricao;
  }

  get categoria(): string | undefined {
    return this.props.categoria;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  // Métodos de domínio
  atualizarQuantidade(novaQuantidade: Quantidade): void {
    this.props.quantidade = novaQuantidade;
  }

  adicionarQuantidade(quantidade: Quantidade): void {
    this.props.quantidade = this.props.quantidade.somar(quantidade);
  }

  removerQuantidade(quantidade: Quantidade): void {
    this.props.quantidade = this.props.quantidade.subtrair(quantidade);
  }

  atualizarPreco(novoPreco: Preco): void {
    this.props.preco = novoPreco;
  }

  atualizarQuantidadeMinima(novaQuantidadeMinima: Quantidade): void {
    this.props.quantidadeMinima = novaQuantidadeMinima;
  }

  ativar(): void {
    this.props.ativo = true;
  }

  desativar(): void {
    this.props.ativo = false;
  }

  estaComEstoqueBaixo(): boolean {
    return this.props.quantidade.isMenorQue(this.props.quantidadeMinima);
  }

  estaSemEstoque(): boolean {
    return this.props.quantidade.isZero();
  }

  calcularValorTotal(): Preco {
    return this.props.preco.multiplicar(this.props.quantidade.valor);
  }

  // Método para criar um produto
  static create(props: Omit<ProdutoProps, 'ativo'>, id?: UniqueEntityId): Produto {
    return new Produto(
      {
        ...props,
        ativo: true,
      },
      id
    );
  }
}
