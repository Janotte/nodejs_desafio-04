import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Email } from '../value-objects/email';

export interface FornecedorProps {
  nome: string;
  email: Email;
  telefone: string;
  endereco: string;
  cnpj: string;
  prazoEntregaDias: number;
  ativo: boolean;
  observacoes?: string;
}

export class Fornecedor extends Entity<FornecedorProps> {
  constructor(props: FornecedorProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get nome(): string {
    return this.props.nome;
  }

  get email(): Email {
    return this.props.email;
  }

  get telefone(): string {
    return this.props.telefone;
  }

  get endereco(): string {
    return this.props.endereco;
  }

  get cnpj(): string {
    return this.props.cnpj;
  }

  get prazoEntregaDias(): number {
    return this.props.prazoEntregaDias;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  get observacoes(): string | undefined {
    return this.props.observacoes;
  }

  // Métodos de domínio
  atualizarDadosContato(email: Email, telefone: string, endereco: string): void {
    this.props.email = email;
    this.props.telefone = telefone;
    this.props.endereco = endereco;
  }

  atualizarPrazoEntrega(prazoDias: number): void {
    if (prazoDias < 0) {
      throw new Error('Prazo de entrega não pode ser negativo');
    }
    this.props.prazoEntregaDias = prazoDias;
  }

  adicionarObservacao(observacao: string): void {
    this.props.observacoes = observacao;
  }

  ativar(): void {
    this.props.ativo = true;
  }

  desativar(): void {
    this.props.ativo = false;
  }

  calcularDataEntregaEstimada(dataPedido: Date): Date {
    const dataEntrega = new Date(dataPedido);
    dataEntrega.setDate(dataEntrega.getDate() + this.props.prazoEntregaDias);
    return dataEntrega;
  }

  // Validação de CNPJ (simplificada)
  private validarCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjLimpo)) {
      return false;
    }

    return true;
  }

  // Método para criar um fornecedor
  static create(
    nome: string,
    email: Email,
    telefone: string,
    endereco: string,
    cnpj: string,
    prazoEntregaDias: number,
    observacoes?: string
  ): Fornecedor {
    const fornecedor = new Fornecedor({
      nome,
      email,
      telefone,
      endereco,
      cnpj,
      prazoEntregaDias,
      ativo: true,
      observacoes,
    });

    // Validação do CNPJ
    if (!fornecedor.validarCNPJ(cnpj)) {
      throw new Error('CNPJ inválido');
    }

    return fornecedor;
  }
}
