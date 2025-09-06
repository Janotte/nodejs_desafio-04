import { Produto } from '../entities/produto';
import { ProdutosRepository } from '../repositories/produtos-repository';
import { Preco } from '../value-objects/preco';
import { Quantidade } from '../value-objects/quantidade';

interface CriarProdutoRequest {
  nome: string;
  cor: string;
  tamanho: string;
  preco: number;
  quantidade: number;
  quantidadeMinima: number;
  descricao?: string;
  categoria?: string;
}

interface CriarProdutoResponse {
  produto: Produto;
}

export class CriarProduto {
  constructor(private produtosRepository: ProdutosRepository) {}

  async execute(request: CriarProdutoRequest): Promise<CriarProdutoResponse> {
    const { nome, cor, tamanho, preco, quantidade, quantidadeMinima, descricao, categoria } =
      request;

    // Verificar se já existe um produto com o mesmo nome
    const produtoExistente = await this.produtosRepository.findByNome(nome);
    if (produtoExistente) {
      throw new Error('Já existe um produto com este nome');
    }

    // Criar os value objects
    const precoValueObject = new Preco(preco);
    const quantidadeValueObject = new Quantidade(quantidade);
    const quantidadeMinimaValueObject = new Quantidade(quantidadeMinima);

    // Criar o produto
    const produto = Produto.create({
      nome,
      cor,
      tamanho,
      preco: precoValueObject,
      quantidade: quantidadeValueObject,
      quantidadeMinima: quantidadeMinimaValueObject,
      descricao,
      categoria,
    });

    // Salvar no repositório
    await this.produtosRepository.create(produto);

    return { produto };
  }
}
