import { describe, it, expect, beforeEach } from 'vitest';
import { OrdemCompra, StatusOrdemCompra } from '../ordem-compra';
import { Preco } from '../../value-objects/preco';
import { Quantidade } from '../../value-objects/quantidade';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('OrdemCompra', () => {
  let fornecedorId: UniqueEntityId;
  let produtoId1: UniqueEntityId;
  let produtoId2: UniqueEntityId;

  beforeEach(() => {
    fornecedorId = new UniqueEntityId();
    produtoId1 = new UniqueEntityId();
    produtoId2 = new UniqueEntityId();
  });

  it('should create purchase order with all properties', () => {
    const ordem = new OrdemCompra({
      fornecedorId,
      itens: [],
      status: StatusOrdemCompra.PENDENTE,
      dataCriacao: new Date('2024-01-15'),
      observacoes: 'Pedido urgente',
      valorTotal: new Preco(0),
      ativo: true,
    });

    expect(ordem.fornecedorId).toBe(fornecedorId);
    expect(ordem.itens).toHaveLength(0);
    expect(ordem.status).toBe(StatusOrdemCompra.PENDENTE);
    expect(ordem.dataCriacao).toEqual(new Date('2024-01-15'));
    expect(ordem.observacoes).toBe('Pedido urgente');
    expect(ordem.valorTotal.valor).toBe(0);
    expect(ordem.ativo).toBe(true);
  });

  it('should create purchase order using static factory method', () => {
    const ordem = OrdemCompra.create(fornecedorId, 'Pedido de teste');

    expect(ordem.fornecedorId).toBe(fornecedorId);
    expect(ordem.itens).toHaveLength(0);
    expect(ordem.status).toBe(StatusOrdemCompra.PENDENTE);
    expect(ordem.observacoes).toBe('Pedido de teste');
    expect(ordem.valorTotal.valor).toBe(0);
    expect(ordem.ativo).toBe(true);
    expect(ordem.dataCriacao).toBeInstanceOf(Date);
  });

  it('should approve pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);

    ordem.aprovar();

    expect(ordem.status).toBe(StatusOrdemCompra.APROVADA);
    expect(ordem.dataAprovacao).toBeInstanceOf(Date);
  });

  it('should throw error when trying to approve non-pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    expect(() => ordem.aprovar()).toThrow('Apenas ordens pendentes podem ser aprovadas');
  });

  it('should send approved order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    ordem.enviar();

    expect(ordem.status).toBe(StatusOrdemCompra.ENVIADA);
    expect(ordem.dataEnvio).toBeInstanceOf(Date);
  });

  it('should throw error when trying to send non-approved order', () => {
    const ordem = OrdemCompra.create(fornecedorId);

    expect(() => ordem.enviar()).toThrow('Apenas ordens aprovadas podem ser enviadas');
  });

  it('should receive sent order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();
    ordem.enviar();

    ordem.receber();

    expect(ordem.status).toBe(StatusOrdemCompra.RECEBIDA);
    expect(ordem.dataRecebimento).toBeInstanceOf(Date);
  });

  it('should throw error when trying to receive non-sent order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    expect(() => ordem.receber()).toThrow('Apenas ordens enviadas podem ser recebidas');
  });

  it('should cancel non-received order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    ordem.cancelar();

    expect(ordem.status).toBe(StatusOrdemCompra.CANCELADA);
  });

  it('should throw error when trying to cancel received order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();
    ordem.enviar();
    ordem.receber();

    expect(() => ordem.cancelar()).toThrow('Ordens já recebidas não podem ser canceladas');
  });

  it('should add item to pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    const quantidade = new Quantidade(10);
    const precoUnitario = new Preco(29.9);

    ordem.adicionarItem(produtoId1, quantidade, precoUnitario);

    expect(ordem.itens).toHaveLength(1);
    expect(ordem.itens[0].produtoId).toBe(produtoId1);
    expect(ordem.itens[0].quantidade).toBe(quantidade);
    expect(ordem.itens[0].precoUnitario).toBe(precoUnitario);
    expect(ordem.itens[0].precoTotal.valor).toBe(299.0); // 10 * 29.90
    expect(ordem.valorTotal.valor).toBe(299.0);
  });

  it('should throw error when adding item to non-pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    expect(() => ordem.adicionarItem(produtoId1, new Quantidade(10), new Preco(29.9))).toThrow(
      'Apenas ordens pendentes podem ter itens adicionados'
    );
  });

  it('should remove item from pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.adicionarItem(produtoId1, new Quantidade(10), new Preco(29.9));
    ordem.adicionarItem(produtoId2, new Quantidade(5), new Preco(19.9));

    ordem.removerItem(produtoId1);

    expect(ordem.itens).toHaveLength(1);
    expect(ordem.itens[0].produtoId).toBe(produtoId2);
    expect(ordem.valorTotal.valor).toBe(99.5); // 5 * 19.90
  });

  it('should throw error when removing item from non-pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    expect(() => ordem.removerItem(produtoId1)).toThrow(
      'Apenas ordens pendentes podem ter itens removidos'
    );
  });

  it('should update item quantity in pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.adicionarItem(produtoId1, new Quantidade(10), new Preco(29.9));

    ordem.atualizarQuantidadeItem(produtoId1, new Quantidade(20));

    expect(ordem.itens[0].quantidade.valor).toBe(20);
    expect(ordem.itens[0].precoTotal.valor).toBe(598.0); // 20 * 29.90
    expect(ordem.valorTotal.valor).toBe(598.0);
  });

  it('should throw error when updating quantity in non-pending order', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.aprovar();

    expect(() => ordem.atualizarQuantidadeItem(produtoId1, new Quantidade(20))).toThrow(
      'Apenas ordens pendentes podem ter quantidades alteradas'
    );
  });

  it('should add observation', () => {
    const ordem = OrdemCompra.create(fornecedorId);

    ordem.adicionarObservacao('Pedido prioritário');

    expect(ordem.observacoes).toBe('Pedido prioritário');
  });

  it('should find item by product ID', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    ordem.adicionarItem(produtoId1, new Quantidade(10), new Preco(29.9));
    ordem.adicionarItem(produtoId2, new Quantidade(5), new Preco(19.9));

    const item = ordem.obterItensPorProduto(produtoId1);

    expect(item).toBeDefined();
    expect(item?.produtoId).toBe(produtoId1);
    expect(item?.quantidade.valor).toBe(10);
  });

  it('should return undefined when item not found', () => {
    const ordem = OrdemCompra.create(fornecedorId);
    const produtoInexistente = new UniqueEntityId();

    const item = ordem.obterItensPorProduto(produtoInexistente);

    expect(item).toBeUndefined();
  });

  it('should calculate days since creation', () => {
    const dataCriacao = new Date('2024-01-01');
    const ordem = new OrdemCompra({
      fornecedorId,
      itens: [],
      status: StatusOrdemCompra.PENDENTE,
      dataCriacao,
      valorTotal: new Preco(0),
      ativo: true,
    });

    // Mock da data atual para teste
    const mockDate = new Date('2024-01-05');
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    const dias = ordem.calcularDiasDesdeCriacao();

    expect(dias).toBe(4);

    vi.restoreAllMocks();
  });

  it('should activate and deactivate order', () => {
    const ordem = OrdemCompra.create(fornecedorId);

    ordem.desativar();
    expect(ordem.ativo).toBe(false);

    ordem.ativar();
    expect(ordem.ativo).toBe(true);
  });

  it('should have unique ID', () => {
    const ordem1 = OrdemCompra.create(fornecedorId);
    const ordem2 = OrdemCompra.create(fornecedorId);

    expect(ordem1.id.equals(ordem2.id)).toBe(false);
  });
});
