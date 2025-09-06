import { ProdutosRepository } from '../repositories/produtos-repository';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Quantidade } from '../value-objects/quantidade';

interface AtualizarEstoqueProdutoRequest {
  produtoId: string;
  novaQuantidade: number;
}

interface AtualizarEstoqueProdutoResponse {
  produto: {
    id: string;
    nome: string;
    quantidade: number;
    quantidadeMinima: number;
    estaComEstoqueBaixo: boolean;
    estaSemEstoque: boolean;
  };
}

export class AtualizarEstoqueProduto {
  constructor(private produtosRepository: ProdutosRepository) {}

  async execute(request: AtualizarEstoqueProdutoRequest): Promise<AtualizarEstoqueProdutoResponse> {
    const { produtoId, novaQuantidade } = request;

    const produtoIdValueObject = new UniqueEntityId(produtoId);
    const produto = await this.produtosRepository.findById(produtoIdValueObject);

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Atualizar a quantidade
    const novaQuantidadeValueObject = new Quantidade(novaQuantidade);
    produto.atualizarQuantidade(novaQuantidadeValueObject);

    // Salvar no repositório
    await this.produtosRepository.update(produto);

    return {
      produto: {
        id: produto.id.toString(),
        nome: produto.nome,
        quantidade: produto.quantidade.valor,
        quantidadeMinima: produto.quantidadeMinima.valor,
        estaComEstoqueBaixo: produto.estaComEstoqueBaixo(),
        estaSemEstoque: produto.estaSemEstoque(),
      },
    };
  }
}
