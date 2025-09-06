import { describe, it, expect, beforeEach } from 'vitest';
import { Produto } from '../produto';
import { Preco } from '../../value-objects/preco';
import { Quantidade } from '../../value-objects/quantidade';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('Produto', () => {
  let produto: Produto;
  let preco: Preco;
  let quantidade: Quantidade;
  let quantidadeMinima: Quantidade;

  beforeEach(() => {
    preco = new Preco(29.9);
    quantidade = new Quantidade(100);
    quantidadeMinima = new Quantidade(10);

    produto = Produto.create({
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco,
      quantidade,
      quantidadeMinima,
      descricao: 'Camiseta de algodão',
      categoria: 'Roupas',
    });
  });

  it('should create a product with all properties', () => {
    expect(produto.nome).toBe('Camiseta Azul');
    expect(produto.cor).toBe('Azul');
    expect(produto.tamanho).toBe('M');
    expect(produto.preco).toBe(preco);
    expect(produto.quantidade).toBe(quantidade);
    expect(produto.quantidadeMinima).toBe(quantidadeMinima);
    expect(produto.descricao).toBe('Camiseta de algodão');
    expect(produto.categoria).toBe('Roupas');
    expect(produto.ativo).toBe(true);
  });

  it('should create a product with minimal properties', () => {
    const produtoMinimo = Produto.create({
      nome: 'Produto Teste',
      cor: 'Vermelho',
      tamanho: 'G',
      preco: new Preco(15.0),
      quantidade: new Quantidade(50),
      quantidadeMinima: new Quantidade(5),
    });

    expect(produtoMinimo.nome).toBe('Produto Teste');
    expect(produtoMinimo.descricao).toBeUndefined();
    expect(produtoMinimo.categoria).toBeUndefined();
    expect(produtoMinimo.ativo).toBe(true);
  });

  it('should update quantity', () => {
    const novaQuantidade = new Quantidade(150);

    produto.atualizarQuantidade(novaQuantidade);

    expect(produto.quantidade).toBe(novaQuantidade);
  });

  it('should add quantity', () => {
    const quantidadeAdicional = new Quantidade(25);

    produto.adicionarQuantidade(quantidadeAdicional);

    expect(produto.quantidade.valor).toBe(125);
  });

  it('should remove quantity', () => {
    const quantidadeRemover = new Quantidade(30);

    produto.removerQuantidade(quantidadeRemover);

    expect(produto.quantidade.valor).toBe(70);
  });

  it('should throw error when removing more quantity than available', () => {
    const quantidadeRemover = new Quantidade(150);

    expect(() => produto.removerQuantidade(quantidadeRemover)).toThrow(
      'Quantidade resultante não pode ser negativa'
    );
  });

  it('should update price', () => {
    const novoPreco = new Preco(35.9);

    produto.atualizarPreco(novoPreco);

    expect(produto.preco).toBe(novoPreco);
  });

  it('should update minimum quantity', () => {
    const novaQuantidadeMinima = new Quantidade(15);

    produto.atualizarQuantidadeMinima(novaQuantidadeMinima);

    expect(produto.quantidadeMinima).toBe(novaQuantidadeMinima);
  });

  it('should activate product', () => {
    produto.desativar();
    expect(produto.ativo).toBe(false);

    produto.ativar();
    expect(produto.ativo).toBe(true);
  });

  it('should deactivate product', () => {
    produto.desativar();
    expect(produto.ativo).toBe(false);
  });

  it('should check if product has low stock', () => {
    // Quantidade atual (100) > quantidade mínima (10)
    expect(produto.estaComEstoqueBaixo()).toBe(false);

    // Reduzir quantidade para abaixo do mínimo
    produto.atualizarQuantidade(new Quantidade(5));
    expect(produto.estaComEstoqueBaixo()).toBe(true);
  });

  it('should check if product is out of stock', () => {
    // Quantidade atual (100) > 0
    expect(produto.estaSemEstoque()).toBe(false);

    // Zerar quantidade
    produto.atualizarQuantidade(new Quantidade(0));
    expect(produto.estaSemEstoque()).toBe(true);
  });

  it('should calculate total value', () => {
    const valorTotal = produto.calcularValorTotal();

    expect(valorTotal.valor).toBe(2990); // 100 * 29.90
  });

  it('should have unique ID', () => {
    const produto2 = Produto.create({
      nome: 'Outro Produto',
      cor: 'Verde',
      tamanho: 'P',
      preco: new Preco(20.0),
      quantidade: new Quantidade(50),
      quantidadeMinima: new Quantidade(5),
    });

    expect(produto.id.equals(produto2.id)).toBe(false);
  });

  it('should check equality correctly', () => {
    const mesmoProduto = new Produto(
      {
        nome: 'Camiseta Azul',
        cor: 'Azul',
        tamanho: 'M',
        preco,
        quantidade,
        quantidadeMinima,
        descricao: 'Camiseta de algodão',
        categoria: 'Roupas',
        ativo: true,
      },
      produto.id
    );

    const produtoDiferente = Produto.create({
      nome: 'Outro Produto',
      cor: 'Verde',
      tamanho: 'P',
      preco: new Preco(20.0),
      quantidade: new Quantidade(50),
      quantidadeMinima: new Quantidade(5),
    });

    expect(produto.equals(mesmoProduto)).toBe(true);
    expect(produto.equals(produtoDiferente)).toBe(false);
  });
});
