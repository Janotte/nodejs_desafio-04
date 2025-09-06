import { HistoricoVendasRepository } from '../repositories/historico-vendas-repository';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';

interface GerarRelatorioVendasRequest {
  dataInicio: Date;
  dataFim: Date;
  produtoId?: string;
}

interface GerarRelatorioVendasResponse {
  periodo: {
    dataInicio: Date;
    dataFim: Date;
  };
  resumo: {
    totalVendas: number;
    valorTotalVendas: number;
    quantidadeTotalVendida: number;
    ticketMedio: number;
  };
  vendasPorProduto: Array<{
    produtoId: string;
    nomeProduto?: string;
    quantidadeVendida: number;
    valorTotal: number;
    numeroVendas: number;
  }>;
  vendas: Array<{
    id: string;
    produtoId: string;
    quantidadeVendida: number;
    precoUnitario: number;
    precoTotal: number;
    dataVenda: Date;
  }>;
}

export class GerarRelatorioVendas {
  constructor(private historicoVendasRepository: HistoricoVendasRepository) {}

  async execute(request: GerarRelatorioVendasRequest): Promise<GerarRelatorioVendasResponse> {
    const { dataInicio, dataFim, produtoId } = request;

    let vendas: any[];

    if (produtoId) {
      const produtoIdValueObject = new UniqueEntityId(produtoId);
      vendas = await this.historicoVendasRepository.findByProdutoIdEPeriodo(
        produtoIdValueObject,
        dataInicio,
        dataFim
      );
    } else {
      vendas = await this.historicoVendasRepository.findByPeriodo(dataInicio, dataFim);
    }

    // Calcular resumo
    const totalVendas = vendas.length;
    const valorTotalVendas = vendas.reduce((total, venda) => total + venda.precoTotal.valor, 0);
    const quantidadeTotalVendida = vendas.reduce(
      (total, venda) => total + venda.quantidadeVendida.valor,
      0
    );
    const ticketMedio = totalVendas > 0 ? valorTotalVendas / totalVendas : 0;

    // Agrupar vendas por produto
    const vendasPorProdutoMap = new Map<
      string,
      {
        produtoId: string;
        quantidadeVendida: number;
        valorTotal: number;
        numeroVendas: number;
      }
    >();

    vendas.forEach(venda => {
      const produtoId = venda.produtoId.toString();
      const existing = vendasPorProdutoMap.get(produtoId);

      if (existing) {
        existing.quantidadeVendida += venda.quantidadeVendida.valor;
        existing.valorTotal += venda.precoTotal.valor;
        existing.numeroVendas += 1;
      } else {
        vendasPorProdutoMap.set(produtoId, {
          produtoId,
          quantidadeVendida: venda.quantidadeVendida.valor,
          valorTotal: venda.precoTotal.valor,
          numeroVendas: 1,
        });
      }
    });

    const vendasPorProduto = Array.from(vendasPorProdutoMap.values());

    return {
      periodo: {
        dataInicio,
        dataFim,
      },
      resumo: {
        totalVendas,
        valorTotalVendas,
        quantidadeTotalVendida,
        ticketMedio,
      },
      vendasPorProduto,
      vendas: vendas.map(venda => ({
        id: venda.id.toString(),
        produtoId: venda.produtoId.toString(),
        quantidadeVendida: venda.quantidadeVendida.valor,
        precoUnitario: venda.precoUnitario.valor,
        precoTotal: venda.precoTotal.valor,
        dataVenda: venda.dataVenda,
      })),
    };
  }
}
