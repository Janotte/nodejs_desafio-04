import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CriarProduto } from '../criar-produto';
import { ProdutosRepository } from '../../repositories/produtos-repository';
import { Produto } from '../../entities/produto';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('CriarProduto', () => {
  let criarProduto: CriarProduto;
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

    criarProduto = new CriarProduto(produtosRepository);
  });

  it('should create a new product successfully', async () => {
    // Arrange
    const request = {
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco: 29.9,
      quantidade: 100,
      quantidadeMinima: 10,
      descricao: 'Camiseta de algodão',
      categoria: 'Roupas',
    };

    vi.mocked(produtosRepository.findByNome).mockResolvedValue(null);

    // Act
    const result = await criarProduto.execute(request);

    // Assert
    expect(result.produto).toBeInstanceOf(Produto);
    expect(result.produto.nome).toBe('Camiseta Azul');
    expect(result.produto.cor).toBe('Azul');
    expect(result.produto.tamanho).toBe('M');
    expect(result.produto.preco.valor).toBe(29.9);
    expect(result.produto.quantidade.valor).toBe(100);
    expect(result.produto.quantidadeMinima.valor).toBe(10);
    expect(result.produto.descricao).toBe('Camiseta de algodão');
    expect(result.produto.categoria).toBe('Roupas');
    expect(result.produto.ativo).toBe(true);

    expect(produtosRepository.findByNome).toHaveBeenCalledWith('Camiseta Azul');
    expect(produtosRepository.create).toHaveBeenCalledWith(result.produto);
  });

  it('should create a product with minimal properties', async () => {
    // Arrange
    const request = {
      nome: 'Produto Simples',
      cor: 'Vermelho',
      tamanho: 'G',
      preco: 15.0,
      quantidade: 50,
      quantidadeMinima: 5,
    };

    vi.mocked(produtosRepository.findByNome).mockResolvedValue(null);

    // Act
    const result = await criarProduto.execute(request);

    // Assert
    expect(result.produto.nome).toBe('Produto Simples');
    expect(result.produto.descricao).toBeUndefined();
    expect(result.produto.categoria).toBeUndefined();
    expect(result.produto.ativo).toBe(true);
  });

  it('should throw error when product name already exists', async () => {
    // Arrange
    const request = {
      nome: 'Produto Existente',
      cor: 'Verde',
      tamanho: 'P',
      preco: 20.0,
      quantidade: 30,
      quantidadeMinima: 5,
    };

    const produtoExistente = Produto.create({
      nome: 'Produto Existente',
      cor: 'Verde',
      tamanho: 'P',
      preco: { valor: 20.0, moeda: 'BRL' } as any,
      quantidade: { valor: 30 } as any,
      quantidadeMinima: { valor: 5 } as any,
    });

    vi.mocked(produtosRepository.findByNome).mockResolvedValue(produtoExistente);

    // Act & Assert
    await expect(criarProduto.execute(request)).rejects.toThrow(
      'Já existe um produto com este nome'
    );
    expect(produtosRepository.findByNome).toHaveBeenCalledWith('Produto Existente');
    expect(produtosRepository.create).not.toHaveBeenCalled();
  });

  it('should round price to 2 decimal places', async () => {
    // Arrange
    const request = {
      nome: 'Produto com Preço',
      cor: 'Amarelo',
      tamanho: 'M',
      preco: 29.999, // Preço com mais de 2 casas decimais
      quantidade: 10,
      quantidadeMinima: 2,
    };

    vi.mocked(produtosRepository.findByNome).mockResolvedValue(null);

    // Act
    const result = await criarProduto.execute(request);

    // Assert
    expect(result.produto.preco.valor).toBe(30.0); // Arredondado para 2 casas decimais
  });

  it('should round quantity to integer', async () => {
    // Arrange
    const request = {
      nome: 'Produto com Quantidade',
      cor: 'Rosa',
      tamanho: 'L',
      preco: 25.0,
      quantidade: 10.7, // Quantidade decimal
      quantidadeMinima: 3.2, // Quantidade mínima decimal
    };

    vi.mocked(produtosRepository.findByNome).mockResolvedValue(null);

    // Act
    const result = await criarProduto.execute(request);

    // Assert
    expect(result.produto.quantidade.valor).toBe(10); // Arredondado para baixo
    expect(result.produto.quantidadeMinima.valor).toBe(3); // Arredondado para baixo
  });
});
