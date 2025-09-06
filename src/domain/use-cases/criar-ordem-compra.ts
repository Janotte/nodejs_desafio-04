import { OrdensCompraRepository } from '../repositories/ordens-compra-repository';
import { FornecedoresRepository } from '../repositories/fornecedores-repository';
import { ProdutosRepository } from '../repositories/produtos-repository';
import { OrdemCompra } from '../entities/ordem-compra';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Preco } from '../value-objects/preco';
import { Quantidade } from '../value-objects/quantidade';

interface ItemOrdemCompraRequest {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

interface CriarOrdemCompraRequest {
  fornecedorId: string;
  itens: ItemOrdemCompraRequest[];
  observacoes?: string;
}

interface CriarOrdemCompraResponse {
  ordemCompra: {
    id: string;
    fornecedorId: string;
    status: string;
    valorTotal: number;
    dataCriacao: Date;
    itens: Array<{
      produtoId: string;
      quantidade: number;
      precoUnitario: number;
      precoTotal: number;
    }>;
  };
}

export class CriarOrdemCompra {
  constructor(
    private ordensCompraRepository: OrdensCompraRepository,
    private fornecedoresRepository: FornecedoresRepository,
    private produtosRepository: ProdutosRepository
  ) {}

  async execute(request: CriarOrdemCompraRequest): Promise<CriarOrdemCompraResponse> {
    const { fornecedorId, itens, observacoes } = request;

    // Verificar se o fornecedor existe e está ativo
    const fornecedorIdValueObject = new UniqueEntityId(fornecedorId);
    const fornecedor = await this.fornecedoresRepository.findById(fornecedorIdValueObject);

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }

    if (!fornecedor.ativo) {
      throw new Error('Fornecedor está inativo');
    }

    // Criar a ordem de compra
    const ordemCompra = OrdemCompra.create(fornecedorIdValueObject, observacoes);

    // Adicionar itens à ordem
    for (const item of itens) {
      const produtoIdValueObject = new UniqueEntityId(item.produtoId);

      // Verificar se o produto existe
      const produto = await this.produtosRepository.findById(produtoIdValueObject);
      if (!produto) {
        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
      }

      const quantidadeValueObject = new Quantidade(item.quantidade);
      const precoUnitarioValueObject = new Preco(item.precoUnitario);

      ordemCompra.adicionarItem(
        produtoIdValueObject,
        quantidadeValueObject,
        precoUnitarioValueObject
      );
    }

    // Salvar a ordem de compra
    await this.ordensCompraRepository.create(ordemCompra);

    return {
      ordemCompra: {
        id: ordemCompra.id.toString(),
        fornecedorId: ordemCompra.fornecedorId.toString(),
        status: ordemCompra.status,
        valorTotal: ordemCompra.valorTotal.valor,
        dataCriacao: ordemCompra.dataCriacao,
        itens: ordemCompra.itens.map(item => ({
          produtoId: item.produtoId.toString(),
          quantidade: item.quantidade.valor,
          precoUnitario: item.precoUnitario.valor,
          precoTotal: item.precoTotal.valor,
        })),
      },
    };
  }
}
