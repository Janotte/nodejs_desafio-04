import { ProdutosRepository } from '../repositories/produtos-repository';
import { AlertasRepository } from '../repositories/alertas-repository';
import { Email } from '../value-objects/email';

interface VerificarEstoqueBaixoRequest {
  emailDestinatario: string;
}

interface VerificarEstoqueBaixoResponse {
  produtosComEstoqueBaixo: Array<{
    id: string;
    nome: string;
    quantidade: number;
    quantidadeMinima: number;
  }>;
  alertasCriados: number;
}

export class VerificarEstoqueBaixo {
  constructor(
    private produtosRepository: ProdutosRepository,
    private alertasRepository: AlertasRepository
  ) {}

  async execute(request: VerificarEstoqueBaixoRequest): Promise<VerificarEstoqueBaixoResponse> {
    const { emailDestinatario } = request;

    // Buscar produtos com estoque baixo
    const produtosComEstoqueBaixo = await this.produtosRepository.findComEstoqueBaixo();

    const emailValueObject = new Email(emailDestinatario);
    let alertasCriados = 0;

    // Criar alertas para cada produto com estoque baixo
    for (const produto of produtosComEstoqueBaixo) {
      const alerta = await this.alertasRepository.findByProdutoId(produto.id);

      // Só criar alerta se não existir um alerta pendente para este produto
      const temAlertaPendente = alerta.some(
        a => a.status === 'PENDENTE' && a.tipo === 'ESTOQUE_BAIXO'
      );

      if (!temAlertaPendente) {
        const novoAlerta = produto.estaSemEstoque()
          ? Alerta.criarAlertaEstoqueZerado(emailValueObject, produto.id, produto.nome)
          : Alerta.criarAlertaEstoqueBaixo(
              emailValueObject,
              produto.id,
              produto.nome,
              produto.quantidade.valor,
              produto.quantidadeMinima.valor
            );

        await this.alertasRepository.create(novoAlerta);
        alertasCriados++;
      }
    }

    return {
      produtosComEstoqueBaixo: produtosComEstoqueBaixo.map(produto => ({
        id: produto.id.toString(),
        nome: produto.nome,
        quantidade: produto.quantidade.valor,
        quantidadeMinima: produto.quantidadeMinima.valor,
      })),
      alertasCriados,
    };
  }
}
