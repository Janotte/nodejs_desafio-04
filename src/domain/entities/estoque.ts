import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Produto } from './produto';
import { Quantidade } from '../value-objects/quantidade';

export interface EstoqueProps {
  produtos: Produto[];
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export class Estoque extends Entity<EstoqueProps> {
  constructor(props: EstoqueProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get produtos(): Produto[] {
    return this.props.produtos;
  }

  get nome(): string {
    return this.props.nome;
  }

  get descricao(): string | undefined {
    return this.props.descricao;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  // Métodos de domínio
  adicionarProduto(produto: Produto): void {
    const produtoExistente = this.buscarProdutoPorId(produto.id);

    if (produtoExistente) {
      // Se o produto já existe, adiciona a quantidade
      produtoExistente.adicionarQuantidade(produto.quantidade);
    } else {
      // Se é um novo produto, adiciona à lista
      this.props.produtos.push(produto);
    }
  }

  removerProduto(produtoId: UniqueEntityId): void {
    this.props.produtos = this.props.produtos.filter(produto => !produto.id.equals(produtoId));
  }

  buscarProdutoPorId(produtoId: UniqueEntityId): Produto | undefined {
    return this.props.produtos.find(produto => produto.id.equals(produtoId));
  }

  buscarProdutosComEstoqueBaixo(): Produto[] {
    return this.props.produtos.filter(produto => produto.estaComEstoqueBaixo());
  }

  buscarProdutosSemEstoque(): Produto[] {
    return this.props.produtos.filter(produto => produto.estaSemEstoque());
  }

  buscarProdutosAtivos(): Produto[] {
    return this.props.produtos.filter(produto => produto.ativo);
  }

  buscarProdutosPorCategoria(categoria: string): Produto[] {
    return this.props.produtos.filter(produto => produto.categoria === categoria);
  }

  atualizarQuantidadeProduto(produtoId: UniqueEntityId, novaQuantidade: Quantidade): void {
    const produto = this.buscarProdutoPorId(produtoId);
    if (produto) {
      produto.atualizarQuantidade(novaQuantidade);
    }
  }

  adicionarQuantidadeProduto(produtoId: UniqueEntityId, quantidade: Quantidade): void {
    const produto = this.buscarProdutoPorId(produtoId);
    if (produto) {
      produto.adicionarQuantidade(quantidade);
    }
  }

  removerQuantidadeProduto(produtoId: UniqueEntityId, quantidade: Quantidade): void {
    const produto = this.buscarProdutoPorId(produtoId);
    if (produto) {
      produto.removerQuantidade(quantidade);
    }
  }

  calcularValorTotalEstoque(): number {
    return this.props.produtos.reduce((total, produto) => {
      return total + produto.calcularValorTotal().valor;
    }, 0);
  }

  obterRelatorioEstoque(): {
    totalProdutos: number;
    produtosComEstoqueBaixo: number;
    produtosSemEstoque: number;
    valorTotalEstoque: number;
  } {
    const produtosComEstoqueBaixo = this.buscarProdutosComEstoqueBaixo().length;
    const produtosSemEstoque = this.buscarProdutosSemEstoque().length;

    return {
      totalProdutos: this.props.produtos.length,
      produtosComEstoqueBaixo,
      produtosSemEstoque,
      valorTotalEstoque: this.calcularValorTotalEstoque(),
    };
  }

  ativar(): void {
    this.props.ativo = true;
  }

  desativar(): void {
    this.props.ativo = false;
  }

  // Método para criar um estoque
  static create(props: Omit<EstoqueProps, 'ativo'>, id?: UniqueEntityId): Estoque {
    return new Estoque(
      {
        ...props,
        ativo: true,
      },
      id
    );
  }
}
