import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegistrarVenda } from '../registrar-venda';
import { ProdutosRepository } from '../../repositories/produtos-repository';
import { HistoricoVendasRepository } from '../../repositories/historico-vendas-repository';
import { Produto } from '../../entities/produto';
import { Preco } from '../../value-objects/preco';
import { Quantidade } from '../../value-objects/quantidade';

describe('RegistrarVenda', () => {
  let registrarVenda: RegistrarVenda;
  let produtosRepository: ProdutosRepository;
  let historicoVendasRepository: HistoricoVendasRepository;

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

    historicoVendasRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByProdutoId: vi.fn(),
      findByClienteId: vi.fn(),
      findByPeriodo: vi.fn(),
      findByProdutoIdEPeriodo: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    registrarVenda = new RegistrarVenda(produtosRepository, historicoVendasRepository);
  });

  it('should register sale successfully', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-123',
      quantidadeVendida: 2,
      precoUnitario: 29.9,
      clienteId: 'cliente-456',
      vendedorId: 'vendedor-789',
      observacoes: 'Venda especial',
    };

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
    const result = await registrarVenda.execute(request);

    // Assert
    expect(result.venda.id).toBeDefined();
    expect(result.venda.produtoId).toBe('produto-123');
    expect(result.venda.quantidadeVendida).toBe(2);
    expect(result.venda.precoUnitario).toBe(29.9);
    expect(result.venda.precoTotal).toBe(59.8); // 2 * 29.90
    expect(result.venda.dataVenda).toBeInstanceOf(Date);

    expect(result.produtoAtualizado.id).toBe(produto.id.toString());
    expect(result.produtoAtualizado.nome).toBe('Camiseta Azul');
    expect(result.produtoAtualizado.quantidadeAtual).toBe(98); // 100 - 2
    expect(result.produtoAtualizado.estaComEstoqueBaixo).toBe(false);

    expect(produtosRepository.findById).toHaveBeenCalledWith(expect.any(Object));
    expect(produtosRepository.update).toHaveBeenCalledWith(produto);
    expect(historicoVendasRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should register sale with minimal parameters', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-123',
      quantidadeVendida: 1,
      precoUnitario: 15.0,
    };

    const produto = Produto.create({
      nome: 'Produto Simples',
      cor: 'Vermelho',
      tamanho: 'G',
      preco: new Preco(15.0),
      quantidade: new Quantidade(50),
      quantidadeMinima: new Quantidade(5),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await registrarVenda.execute(request);

    // Assert
    expect(result.venda.produtoId).toBe('produto-123');
    expect(result.venda.quantidadeVendida).toBe(1);
    expect(result.venda.precoUnitario).toBe(15.0);
    expect(result.venda.precoTotal).toBe(15.0);

    expect(result.produtoAtualizado.quantidadeAtual).toBe(49); // 50 - 1
  });

  it('should throw error when product not found', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-inexistente',
      quantidadeVendida: 1,
      precoUnitario: 20.0,
    };

    vi.mocked(produtosRepository.findById).mockResolvedValue(null);

    // Act & Assert
    await expect(registrarVenda.execute(request)).rejects.toThrow('Produto não encontrado');

    expect(produtosRepository.findById).toHaveBeenCalledWith(expect.any(Object));
    expect(produtosRepository.update).not.toHaveBeenCalled();
    expect(historicoVendasRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when product is inactive', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-123',
      quantidadeVendida: 1,
      precoUnitario: 20.0,
    };

    const produto = Produto.create({
      nome: 'Produto Inativo',
      cor: 'Verde',
      tamanho: 'P',
      preco: new Preco(20.0),
      quantidade: new Quantidade(10),
      quantidadeMinima: new Quantidade(2),
      categoria: 'Roupas',
    });

    produto.desativar();

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act & Assert
    await expect(registrarVenda.execute(request)).rejects.toThrow('Produto está inativo');

    expect(produtosRepository.findById).toHaveBeenCalledWith(expect.any(Object));
    expect(produtosRepository.update).not.toHaveBeenCalled();
    expect(historicoVendasRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when insufficient stock', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-123',
      quantidadeVendida: 100, // Mais que o estoque disponível
      precoUnitario: 20.0,
    };

    const produto = Produto.create({
      nome: 'Produto com Pouco Estoque',
      cor: 'Amarelo',
      tamanho: 'M',
      preco: new Preco(20.0),
      quantidade: new Quantidade(50), // Estoque menor que a quantidade solicitada
      quantidadeMinima: new Quantidade(5),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act & Assert
    await expect(registrarVenda.execute(request)).rejects.toThrow(
      'Estoque insuficiente para esta venda'
    );

    expect(produtosRepository.findById).toHaveBeenCalledWith(expect.any(Object));
    expect(produtosRepository.update).not.toHaveBeenCalled();
    expect(historicoVendasRepository.create).not.toHaveBeenCalled();
  });

  it('should detect low stock after sale', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-123',
      quantidadeVendida: 95, // Vai deixar o estoque baixo
      precoUnitario: 20.0,
    };

    const produto = Produto.create({
      nome: 'Produto com Estoque Baixo',
      cor: 'Rosa',
      tamanho: 'L',
      preco: new Preco(20.0),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(10), // Mínimo de 10
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await registrarVenda.execute(request);

    // Assert
    expect(result.produtoAtualizado.quantidadeAtual).toBe(5); // 100 - 95
    expect(result.produtoAtualizado.estaComEstoqueBaixo).toBe(true);
    expect(result.produtoAtualizado.estaSemEstoque).toBe(false);
  });

  it('should round quantity to integer', async () => {
    // Arrange
    const request = {
      produtoId: 'produto-123',
      quantidadeVendida: 2.7, // Quantidade decimal
      precoUnitario: 20.0,
    };

    const produto = Produto.create({
      nome: 'Produto Teste',
      cor: 'Azul',
      tamanho: 'M',
      preco: new Preco(20.0),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(5),
      categoria: 'Roupas',
    });

    vi.mocked(produtosRepository.findById).mockResolvedValue(produto);

    // Act
    const result = await registrarVenda.execute(request);

    // Assert
    expect(result.venda.quantidadeVendida).toBe(2); // Arredondado para baixo
    expect(result.produtoAtualizado.quantidadeAtual).toBe(98); // 100 - 2
  });
});
