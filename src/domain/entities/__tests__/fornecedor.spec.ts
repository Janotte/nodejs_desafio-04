import { describe, it, expect, beforeEach } from 'vitest';
import { Fornecedor } from '../fornecedor';
import { Email } from '../../value-objects/email';

describe('Fornecedor', () => {
  let email: Email;

  beforeEach(() => {
    email = new Email('fornecedor@empresa.com');
  });

  it('should create supplier with all properties', () => {
    const fornecedor = new Fornecedor({
      nome: 'Fornecedor ABC',
      email,
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123',
      cnpj: '12.345.678/0001-90',
      prazoEntregaDias: 7,
      ativo: true,
      observacoes: 'Fornecedor confiável',
    });

    expect(fornecedor.nome).toBe('Fornecedor ABC');
    expect(fornecedor.email).toBe(email);
    expect(fornecedor.telefone).toBe('(11) 99999-9999');
    expect(fornecedor.endereco).toBe('Rua das Flores, 123');
    expect(fornecedor.cnpj).toBe('12.345.678/0001-90');
    expect(fornecedor.prazoEntregaDias).toBe(7);
    expect(fornecedor.ativo).toBe(true);
    expect(fornecedor.observacoes).toBe('Fornecedor confiável');
  });

  it('should create supplier using static factory method', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor XYZ',
      email,
      '(11) 88888-8888',
      'Av. Principal, 456',
      '98.765.432/0001-10',
      5,
      'Fornecedor premium'
    );

    expect(fornecedor.nome).toBe('Fornecedor XYZ');
    expect(fornecedor.email).toBe(email);
    expect(fornecedor.telefone).toBe('(11) 88888-8888');
    expect(fornecedor.endereco).toBe('Av. Principal, 456');
    expect(fornecedor.cnpj).toBe('98.765.432/0001-10');
    expect(fornecedor.prazoEntregaDias).toBe(5);
    expect(fornecedor.ativo).toBe(true);
    expect(fornecedor.observacoes).toBe('Fornecedor premium');
  });

  it('should throw error for invalid CNPJ', () => {
    expect(() =>
      Fornecedor.create(
        'Fornecedor Inválido',
        email,
        '(11) 77777-7777',
        'Rua Teste, 789',
        '123', // CNPJ inválido
        3
      )
    ).toThrow('CNPJ inválido');
  });

  it('should throw error for CNPJ with all same digits', () => {
    expect(() =>
      Fornecedor.create(
        'Fornecedor Inválido',
        email,
        '(11) 77777-7777',
        'Rua Teste, 789',
        '11.111.111/1111-11', // CNPJ com todos os dígitos iguais
        3
      )
    ).toThrow('CNPJ inválido');
  });

  it('should update contact information', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor Original',
      email,
      '(11) 11111-1111',
      'Rua Original, 111',
      '11.111.111/0001-11',
      5
    );

    const novoEmail = new Email('novo@fornecedor.com');
    fornecedor.atualizarDadosContato(novoEmail, '(11) 22222-2222', 'Rua Nova, 222');

    expect(fornecedor.email).toBe(novoEmail);
    expect(fornecedor.telefone).toBe('(11) 22222-2222');
    expect(fornecedor.endereco).toBe('Rua Nova, 222');
  });

  it('should update delivery deadline', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor Teste',
      email,
      '(11) 33333-3333',
      'Rua Teste, 333',
      '33.333.333/0001-33',
      5
    );

    fornecedor.atualizarPrazoEntrega(10);

    expect(fornecedor.prazoEntregaDias).toBe(10);
  });

  it('should throw error for negative delivery deadline', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor Teste',
      email,
      '(11) 33333-3333',
      'Rua Teste, 333',
      '33.333.333/0001-33',
      5
    );

    expect(() => fornecedor.atualizarPrazoEntrega(-1)).toThrow(
      'Prazo de entrega não pode ser negativo'
    );
  });

  it('should add observation', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor Teste',
      email,
      '(11) 44444-4444',
      'Rua Teste, 444',
      '44.444.444/0001-44',
      3
    );

    fornecedor.adicionarObservacao('Fornecedor com excelente qualidade');

    expect(fornecedor.observacoes).toBe('Fornecedor com excelente qualidade');
  });

  it('should activate and deactivate supplier', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor Teste',
      email,
      '(11) 55555-5555',
      'Rua Teste, 555',
      '55.555.555/0001-55',
      3
    );

    fornecedor.desativar();
    expect(fornecedor.ativo).toBe(false);

    fornecedor.ativar();
    expect(fornecedor.ativo).toBe(true);
  });

  it('should calculate estimated delivery date', () => {
    const fornecedor = Fornecedor.create(
      'Fornecedor Teste',
      email,
      '(11) 66666-6666',
      'Rua Teste, 666',
      '66.666.666/0001-66',
      7
    );

    const dataPedido = new Date('2024-01-01');
    const dataEntregaEstimada = fornecedor.calcularDataEntregaEstimada(dataPedido);

    const dataEsperada = new Date('2024-01-08'); // 1 de janeiro + 7 dias
    expect(dataEntregaEstimada).toEqual(dataEsperada);
  });

  it('should have unique ID', () => {
    const fornecedor1 = Fornecedor.create(
      'Fornecedor 1',
      email,
      '(11) 11111-1111',
      'Rua 1, 111',
      '11.111.111/0001-11',
      3
    );

    const fornecedor2 = Fornecedor.create(
      'Fornecedor 2',
      email,
      '(11) 22222-2222',
      'Rua 2, 222',
      '22.222.222/0001-22',
      5
    );

    expect(fornecedor1.id.equals(fornecedor2.id)).toBe(false);
  });

  it('should check equality correctly', () => {
    const fornecedor1 = Fornecedor.create(
      'Fornecedor Teste',
      email,
      '(11) 77777-7777',
      'Rua Teste, 777',
      '77.777.777/0001-77',
      3
    );

    const fornecedor2 = new Fornecedor(
      {
        nome: 'Fornecedor Teste',
        email,
        telefone: '(11) 77777-7777',
        endereco: 'Rua Teste, 777',
        cnpj: '77.777.777/0001-77',
        prazoEntregaDias: 3,
        ativo: true,
      },
      fornecedor1.id
    );

    const fornecedor3 = Fornecedor.create(
      'Outro Fornecedor',
      email,
      '(11) 88888-8888',
      'Rua Outra, 888',
      '88.888.888/0001-88',
      5
    );

    expect(fornecedor1.equals(fornecedor2)).toBe(true);
    expect(fornecedor1.equals(fornecedor3)).toBe(false);
  });
});
