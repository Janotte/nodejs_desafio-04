import { describe, it, expect, beforeEach } from 'vitest';
import { HistoricoVendas } from '../historico-vendas';
import { Preco } from '../../value-objects/preco';
import { Quantidade } from '../../value-objects/quantidade';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('HistoricoVendas', () => {
  let produtoId: UniqueEntityId;
  let clienteId: UniqueEntityId;
  let vendedorId: UniqueEntityId;
  let quantidadeVendida: Quantidade;
  let precoUnitario: Preco;

  beforeEach(() => {
    produtoId = new UniqueEntityId();
    clienteId = new UniqueEntityId();
    vendedorId = new UniqueEntityId();
    quantidadeVendida = new Quantidade(2);
    precoUnitario = new Preco(29.9);
  });

  it('should create sale record with all properties', () => {
    const venda = new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
      dataVenda: new Date('2024-01-15'),
      clienteId,
      vendedorId,
      desconto: new Preco(5.0),
      observacoes: 'Venda com desconto especial',
    });

    expect(venda.produtoId).toBe(produtoId);
    expect(venda.quantidadeVendida).toBe(quantidadeVendida);
    expect(venda.precoUnitario).toBe(precoUnitario);
    expect(venda.precoTotal.valor).toBe(59.8); // 2 * 29.90
    expect(venda.dataVenda).toEqual(new Date('2024-01-15'));
    expect(venda.clienteId).toBe(clienteId);
    expect(venda.vendedorId).toBe(vendedorId);
    expect(venda.desconto?.valor).toBe(5.0);
    expect(venda.observacoes).toBe('Venda com desconto especial');
  });

  it('should create sale record with minimal properties', () => {
    const venda = new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
      dataVenda: new Date('2024-01-15'),
    });

    expect(venda.produtoId).toBe(produtoId);
    expect(venda.clienteId).toBeUndefined();
    expect(venda.vendedorId).toBeUndefined();
    expect(venda.desconto).toBeUndefined();
    expect(venda.observacoes).toBeUndefined();
  });

  it('should calculate profit correctly', () => {
    const venda = new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
      dataVenda: new Date('2024-01-15'),
    });

    const custoUnitario = new Preco(15.0);
    const lucro = venda.calcularLucro(custoUnitario);

    // Lucro unitário: 29.90 - 15.00 = 14.90
    // Lucro total: 14.90 * 2 = 29.80
    expect(lucro.valor).toBe(29.8);
  });

  it('should calculate profit margin correctly', () => {
    const venda = new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
      dataVenda: new Date('2024-01-15'),
    });

    const custoUnitario = new Preco(15.0);
    const margemLucro = venda.calcularMargemLucro(custoUnitario);

    // Margem: (29.90 - 15.00) / 29.90 * 100 = 14.90 / 29.90 * 100 = 49.83%
    expect(margemLucro).toBeCloseTo(49.83, 2);
  });

  it('should apply discount correctly', () => {
    const venda = new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
      dataVenda: new Date('2024-01-15'),
    });

    const desconto = new Preco(10.0);
    venda.aplicarDesconto(desconto);

    expect(venda.desconto).toBe(desconto);
    expect(venda.precoTotal.valor).toBe(49.8); // 59.80 - 10.00
  });

  it('should add observation', () => {
    const venda = new HistoricoVendas({
      produtoId,
      quantidadeVendida,
      precoUnitario,
      precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
      dataVenda: new Date('2024-01-15'),
    });

    venda.adicionarObservacao('Cliente VIP');

    expect(venda.observacoes).toBe('Cliente VIP');
  });

  it('should create sale using static factory method', () => {
    const venda = HistoricoVendas.create(
      produtoId,
      quantidadeVendida,
      precoUnitario,
      clienteId,
      vendedorId,
      'Venda especial'
    );

    expect(venda.produtoId).toBe(produtoId);
    expect(venda.quantidadeVendida).toBe(quantidadeVendida);
    expect(venda.precoUnitario).toBe(precoUnitario);
    expect(venda.precoTotal.valor).toBe(59.8);
    expect(venda.clienteId).toBe(clienteId);
    expect(venda.vendedorId).toBe(vendedorId);
    expect(venda.observacoes).toBe('Venda especial');
    expect(venda.dataVenda).toBeInstanceOf(Date);
  });

  it('should create sale with minimal parameters', () => {
    const venda = HistoricoVendas.create(produtoId, quantidadeVendida, precoUnitario);

    expect(venda.produtoId).toBe(produtoId);
    expect(venda.clienteId).toBeUndefined();
    expect(venda.vendedorId).toBeUndefined();
    expect(venda.observacoes).toBeUndefined();
  });

  it('should have unique ID', () => {
    const venda1 = HistoricoVendas.create(produtoId, quantidadeVendida, precoUnitario);
    const venda2 = HistoricoVendas.create(produtoId, quantidadeVendida, precoUnitario);

    expect(venda1.id.equals(venda2.id)).toBe(false);
  });

  it('should check equality correctly', () => {
    const venda1 = HistoricoVendas.create(produtoId, quantidadeVendida, precoUnitario);
    const venda2 = new HistoricoVendas(
      {
        produtoId,
        quantidadeVendida,
        precoUnitario,
        precoTotal: precoUnitario.multiplicar(quantidadeVendida.valor),
        dataVenda: new Date('2024-01-15'),
      },
      venda1.id
    );

    const venda3 = HistoricoVendas.create(produtoId, quantidadeVendida, precoUnitario);

    expect(venda1.equals(venda2)).toBe(true);
    expect(venda1.equals(venda3)).toBe(false);
  });
});
