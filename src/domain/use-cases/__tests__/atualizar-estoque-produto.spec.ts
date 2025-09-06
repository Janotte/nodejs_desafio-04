import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AtualizarEstoqueProduto } from '../atualizar-estoque-produto';
import { ProdutosRepository } from '../../repositories/produtos-repository';
import { Produto } from '../../entities/produto';
import { Preco } from '../../value-objects/preco';
import { Quantidade } from '../../value-objects/quantidade';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('AtualizarEstoqueProduto', () => {
  let atualizarEstoqueProduto: AtualizarEstoqueProduto;
  let produtosRepository: ProdutosRepository;

  beforeEach(() => {
    produtosRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByNome: vi.fn(),
      findByCategoria: vi.fn(),
      findComEstoqueBaixo: vi.fn(),
      findSemEstoque: vi.fn(),
      findAtivos: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    atualizarEstoqueProduto = new AtualizarEstoqueProduto(produtosRepository);
  });

  it('should update product stock successfully', async () => {
    // Arrange
    const produtoId = 'produto-123';
    const novaQuantidade = 150;

    const produto = Produto.create({
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco: new Preco(29.9),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(10),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await atualizarEstoqueProduto.execute({
      produtoId,
      novaQuantidade,
    });

    // Assert
    expect(result.produto.id).toBe(produto.id.toString());
    expect(result.produto.nome).toBe('Camiseta Azul');
    expect(result.produto.quantidade).toBe(150);
    expect(result.produto.quantidadeMinima).toBe(10);
    expect(result.produto.estaComEstoqueBaixo).toBe(false);
    expect(result.produto.estaSemEstoque).toBe(false);

    expect(produtosRepository.findById).toHaveBeenCalledWith(expect.any(UniqueEntityId));
    expect(produtosRepository.update).toHaveBeenCalledWith(produto);
  });

  it('should detect low stock when quantity is below minimum', async () => {
    // Arrange
    const produtoId = 'produto-123';
    const novaQuantidade = 5; // Abaixo do mínimo de 10

    const produto = Produto.create({
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco: new Preco(29.9),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(10),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await atualizarEstoqueProduto.execute({
      produtoId,
      novaQuantidade,
    });

    // Assert
    expect(result.produto.quantidade).toBe(5);
    expect(result.produto.estaComEstoqueBaixo).toBe(true);
    expect(result.produto.estaSemEstoque).toBe(false);
  });

  it('should detect out of stock when quantity is zero', async () => {
    // Arrange
    const produtoId = 'produto-123';
    const novaQuantidade = 0;

    const produto = Produto.create({
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco: new Preco(29.9),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(10),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await atualizarEstoqueProduto.execute({
      produtoId,
      novaQuantidade,
    });

    // Assert
    expect(result.produto.quantidade).toBe(0);
    expect(result.produto.estaComEstoqueBaixo).toBe(true);
    expect(result.produto.estaSemEstoque).toBe(true);
  });

  it('should throw error when product not found', async () => {
    // Arrange
    const produtoId = 'produto-inexistente';
    const novaQuantidade = 50;

    vi.mocked(produtosRepository.findById).mockResolvedValue(null);

    // Act & Assert
    await expect(
      atualizarEstoqueProduto.execute({
        produtoId,
        novaQuantidade,
      })
    ).rejects.toThrow('Produto não encontrado');

    expect(produtosRepository.findById).toHaveBeenCalledWith(expect.any(UniqueEntityId));
    expect(produtosRepository.update).not.toHaveBeenCalled();
  });

  it('should round quantity to integer', async () => {
    // Arrange
    const produtoId = 'produto-123';
    const novaQuantidade = 50.7; // Quantidade decimal

    const produto = Produto.create({
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco: new Preco(29.9),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(10),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await atualizarEstoqueProduto.execute({
      produtoId,
      novaQuantidade,
    });

    // Assert
    expect(result.produto.quantidade).toBe(50); // Arredondado para baixo
  });
});
