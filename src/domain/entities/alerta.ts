import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Email } from '../value-objects/email';

export enum TipoAlerta {
  ESTOQUE_BAIXO = 'ESTOQUE_BAIXO',
  ESTOQUE_ZERADO = 'ESTOQUE_ZERADO',
  PEDIDO_CHEGOU = 'PEDIDO_CHEGOU',
  PEDIDO_ATRASADO = 'PEDIDO_ATRASADO',
}

export enum StatusAlerta {
  PENDENTE = 'PENDENTE',
  ENVIADO = 'ENVIADO',
  FALHOU = 'FALHOU',
}

export interface AlertaProps {
  tipo: TipoAlerta;
  status: StatusAlerta;
  titulo: string;
  mensagem: string;
  destinatario: Email;
  produtoId?: UniqueEntityId;
  dataEnvio?: Date;
  tentativasEnvio: number;
  maxTentativas: number;
  ativo: boolean;
}

export class Alerta extends Entity<AlertaProps> {
  constructor(props: AlertaProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get tipo(): TipoAlerta {
    return this.props.tipo;
  }

  get status(): StatusAlerta {
    return this.props.status;
  }

  get titulo(): string {
    return this.props.titulo;
  }

  get mensagem(): string {
    return this.props.mensagem;
  }

  get destinatario(): Email {
    return this.props.destinatario;
  }

  get produtoId(): UniqueEntityId | undefined {
    return this.props.produtoId;
  }

  get dataEnvio(): Date | undefined {
    return this.props.dataEnvio;
  }

  get tentativasEnvio(): number {
    return this.props.tentativasEnvio;
  }

  get maxTentativas(): number {
    return this.props.maxTentativas;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  // Métodos de domínio
  marcarComoEnviado(): void {
    this.props.status = StatusAlerta.ENVIADO;
    this.props.dataEnvio = new Date();
  }

  marcarComoFalhou(): void {
    this.props.tentativasEnvio += 1;

    if (this.props.tentativasEnvio >= this.props.maxTentativas) {
      this.props.status = StatusAlerta.FALHOU;
    } else {
      this.props.status = StatusAlerta.PENDENTE;
    }
  }

  podeTentarEnviar(): boolean {
    return (
      this.props.status === StatusAlerta.PENDENTE &&
      this.props.tentativasEnvio < this.props.maxTentativas
    );
  }

  ativar(): void {
    this.props.ativo = true;
  }

  desativar(): void {
    this.props.ativo = false;
  }

  atualizarMensagem(novaMensagem: string): void {
    this.props.mensagem = novaMensagem;
  }

  atualizarTitulo(novoTitulo: string): void {
    this.props.titulo = novoTitulo;
  }

  // Métodos estáticos para criar alertas específicos
  static criarAlertaEstoqueBaixo(
    destinatario: Email,
    produtoId: UniqueEntityId,
    nomeProduto: string,
    quantidadeAtual: number,
    quantidadeMinima: number
  ): Alerta {
    return new Alerta({
      tipo: TipoAlerta.ESTOQUE_BAIXO,
      status: StatusAlerta.PENDENTE,
      titulo: `Estoque Baixo - ${nomeProduto}`,
      mensagem: `O produto ${nomeProduto} está com estoque baixo. Quantidade atual: ${quantidadeAtual}, Mínima: ${quantidadeMinima}`,
      destinatario,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });
  }

  static criarAlertaEstoqueZerado(
    destinatario: Email,
    produtoId: UniqueEntityId,
    nomeProduto: string
  ): Alerta {
    return new Alerta({
      tipo: TipoAlerta.ESTOQUE_ZERADO,
      status: StatusAlerta.PENDENTE,
      titulo: `Estoque Zerado - ${nomeProduto}`,
      mensagem: `O produto ${nomeProduto} está sem estoque. É necessário fazer um novo pedido.`,
      destinatario,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });
  }

  static criarAlertaPedidoChegou(
    destinatario: Email,
    produtoId: UniqueEntityId,
    nomeProduto: string
  ): Alerta {
    return new Alerta({
      tipo: TipoAlerta.PEDIDO_CHEGOU,
      status: StatusAlerta.PENDENTE,
      titulo: `Pedido Chegou - ${nomeProduto}`,
      mensagem: `O pedido do produto ${nomeProduto} chegou e foi adicionado ao estoque.`,
      destinatario,
      produtoId,
      tentativasEnvio: 0,
      maxTentativas: 3,
      ativo: true,
    });
  }
}
