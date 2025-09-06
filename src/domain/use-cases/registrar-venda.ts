import { ProdutosRepository } from '../repositories/produtos-repository';
import { HistoricoVendasRepository } from '../repositories/historico-vendas-repository';
import { HistoricoVendas } from '../entities/historico-vendas';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Preco } from '../value-objects/preco';
import { Quantidade } from '../value-objects/quantidade';

interface RegistrarVendaRequest {
  produtoId: string;
  quantidadeVendida: number;
  precoUnitario: number;
  clienteId?: string;
  vendedorId?: string;
  observacoes?: string;
}

interface RegistrarVendaResponse {
  venda: {
    id: string;
    produtoId: string;
    quantidadeVendida: number;
    precoUnitario: number;
    precoTotal: number;
    dataVenda: Date;
  };
  produtoAtualizado: {
    id: string;
    nome: string;
    quantidadeAtual: number;
    estaComEstoqueBaixo: boolean;
    estaSemEstoque: boolean;
  };
}

export class RegistrarVenda {
  constructor(
    private produtosRepository: ProdutosRepository,
    private historicoVendasRepository: HistoricoVendasRepository
  ) {}

  async execute(request: RegistrarVendaRequest): Promise<RegistrarVendaResponse> {
    const { produtoId, quantidadeVendida, precoUnitario, clienteId, vendedorId, observacoes } =
      request;

    const produtoIdValueObject = new UniqueEntityId(produtoId);
    const produto = await this.produtosRepository.findById(produtoIdValueObject);

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (!produto.ativo) {
      throw new Error('Produto está inativo');
    }

    const quantidadeVendidaValueObject = new Quantidade(quantidadeVendida);
    const precoUnitarioValueObject = new Preco(precoUnitario);

    // Verificar se há estoque suficiente
    if (produto.quantidade.isMenorQue(quantidadeVendidaValueObject)) {
      throw new Error('Estoque insuficiente para esta venda');
    }

    // Criar o registro de venda
    const venda = HistoricoVendas.create(
      produtoIdValueObject,
      quantidadeVendidaValueObject,
      precoUnitarioValueObject,
      clienteId ? new UniqueEntityId(clienteId) : undefined,
      vendedorId ? new UniqueEntityId(vendedorId) : undefined,
      observacoes
    );

    // Atualizar o estoque do produto
    produto.removerQuantidade(quantidadeVendidaValueObject);

    // Salvar as alterações
    await this.historicoVendasRepository.create(venda);
    await this.produtosRepository.update(produto);

    return {
      venda: {
        id: venda.id.toString(),
        produtoId: venda.produtoId.toString(),
        quantidadeVendida: venda.quantidadeVendida.valor,
        precoUnitario: venda.precoUnitario.valor,
        precoTotal: venda.precoTotal.valor,
        dataVenda: venda.dataVenda,
      },
      produtoAtualizado: {
        id: produto.id.toString(),
        nome: produto.nome,
        quantidadeAtual: produto.quantidade.valor,
        estaComEstoqueBaixo: produto.estaComEstoqueBaixo(),
        estaSemEstoque: produto.estaSemEstoque(),
      },
    };
  }
}
