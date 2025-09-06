import { describe, it, expect, beforeEach } from 'vitest';
import { Estoque } from '../estoque';
import { Produto } from '../produto';
import { Preco } from '../../value-objects/preco';
import { Quantidade } from '../../value-objects/quantidade';
import { UniqueEntityId } from '../../../core/entities/unique-entity-id';

describe('Estoque', () => {
  let estoque: Estoque;
  let produto1: Produto;
  let produto2: Produto;
  let produto3: Produto;

  beforeEach(() => {
    produto1 = Produto.create({
      nome: 'Camiseta Azul',
      cor: 'Azul',
      tamanho: 'M',
      preco: new Preco(29.9),
      quantidade: new Quantidade(100),
      quantidadeMinima: new Quantidade(10),
      categoria: 'Roupas',
    });

    produto2 = Produto.create({
      nome: 'Calça Jeans',
      cor: 'Azul',
      tamanho: '42',
      preco: new Preco(89.9),
      quantidade: new Quantidade(5), // Estoque baixo
      quantidadeMinima: new Quantidade(10),
      categoria: 'Roupas',
    });

    produto3 = Produto.create({
      nome: 'Tênis',
      cor: 'Branco',
      tamanho: '40',
      preco: new Preco(199.9),
      quantidade: new Quantidade(0), // Sem estoque
      quantidadeMinima: new Quantidade(5),
      categoria: 'Calçados',
    });

    estoque = Estoque.create({
      produtos: [produto1, produto2, produto3],
      nome: 'Estoque Principal',
      descricao: 'Estoque da loja principal',
    });
  });

  it('should create stock with products', () => {
    expect(estoque.nome).toBe('Estoque Principal');
    expect(estoque.descricao).toBe('Estoque da loja principal');
    expect(estoque.produtos).toHaveLength(3);
    expect(estoque.ativo).toBe(true);
  });

  it('should add new product to stock', () => {
    const novoProduto = Produto.create({
      nome: 'Boné',
      cor: 'Preto',
      tamanho: 'Único',
      preco: new Preco(39.9),
      quantidade: new Quantidade(20),
      quantidadeMinima: new Quantidade(5),
      categoria: 'Acessórios',
    });

    estoque.adicionarProduto(novoProduto);

    expect(estoque.produtos).toHaveLength(4);
    expect(estoque.buscarProdutoPorId(novoProduto.id)).toBe(novoProduto);
  });

  it('should add quantity to existing product', () => {
    // Criar um produto com o mesmo ID do produto1
    const produtoExistente = new Produto(
      {
        nome: 'Camiseta Azul',
        cor: 'Azul',
        tamanho: 'M',
        preco: new Preco(29.9),
        quantidade: new Quantidade(50),
        quantidadeMinima: new Quantidade(10),
        categoria: 'Roupas',
        ativo: true,
      },
      produto1.id
    );

    estoque.adicionarProduto(produtoExistente);

    // Deve somar a quantidade ao produto existente
    const produtoNoEstoque = estoque.buscarProdutoPorId(produto1.id);
    expect(produtoNoEstoque?.quantidade.valor).toBe(150); // 100 + 50
  });

  it('should remove product from stock', () => {
    estoque.removerProduto(produto1.id);

    expect(estoque.produtos).toHaveLength(2);
    expect(estoque.buscarProdutoPorId(produto1.id)).toBeUndefined();
  });

  it('should find product by ID', () => {
    const produtoEncontrado = estoque.buscarProdutoPorId(produto1.id);

    expect(produtoEncontrado).toBe(produto1);
  });

  it('should return undefined when product not found', () => {
    const idInexistente = new UniqueEntityId();
    const produtoEncontrado = estoque.buscarProdutoPorId(idInexistente);

    expect(produtoEncontrado).toBeUndefined();
  });

  it('should find products with low stock', () => {
    const produtosComEstoqueBaixo = estoque.buscarProdutosComEstoqueBaixo();

    expect(produtosComEstoqueBaixo).toHaveLength(2); // produto2 e produto3
    expect(produtosComEstoqueBaixo).toContain(produto2);
    expect(produtosComEstoqueBaixo).toContain(produto3);
  });

  it('should find products out of stock', () => {
    const produtosSemEstoque = estoque.buscarProdutosSemEstoque();

    expect(produtosSemEstoque).toHaveLength(1);
    expect(produtosSemEstoque[0]).toBe(produto3);
  });

  it('should find active products', () => {
    produto2.desativar();

    const produtosAtivos = estoque.buscarProdutosAtivos();

    expect(produtosAtivos).toHaveLength(2);
    expect(produtosAtivos).toContain(produto1);
    expect(produtosAtivos).toContain(produto3);
    expect(produtosAtivos).not.toContain(produto2);
  });

  it('should find products by category', () => {
    const produtosRoupas = estoque.buscarProdutosPorCategoria('Roupas');

    expect(produtosRoupas).toHaveLength(2);
    expect(produtosRoupas).toContain(produto1);
    expect(produtosRoupas).toContain(produto2);
  });

  it('should update product quantity', () => {
    const novaQuantidade = new Quantidade(200);

    estoque.atualizarQuantidadeProduto(produto1.id, novaQuantidade);

    const produtoAtualizado = estoque.buscarProdutoPorId(produto1.id);
    expect(produtoAtualizado?.quantidade).toBe(novaQuantidade);
  });

  it('should add quantity to product', () => {
    const quantidadeAdicional = new Quantidade(50);

    estoque.adicionarQuantidadeProduto(produto1.id, quantidadeAdicional);

    const produtoAtualizado = estoque.buscarProdutoPorId(produto1.id);
    expect(produtoAtualizado?.quantidade.valor).toBe(150);
  });

  it('should remove quantity from product', () => {
    const quantidadeRemover = new Quantidade(30);

    estoque.removerQuantidadeProduto(produto1.id, quantidadeRemover);

    const produtoAtualizado = estoque.buscarProdutoPorId(produto1.id);
    expect(produtoAtualizado?.quantidade.valor).toBe(70);
  });

  it('should calculate total stock value', () => {
    const valorTotal = estoque.calcularValorTotalEstoque();

    // (100 * 29.90) + (5 * 89.90) + (0 * 199.90) = 2990 + 449.5 + 0 = 3439.5
    expect(valorTotal).toBe(3439.5);
  });

  it('should generate stock report', () => {
    const relatorio = estoque.obterRelatorioEstoque();

    expect(relatorio.totalProdutos).toBe(3);
    expect(relatorio.produtosComEstoqueBaixo).toBe(2); // produto2 e produto3
    expect(relatorio.produtosSemEstoque).toBe(1);
    expect(relatorio.valorTotalEstoque).toBe(3439.5);
  });

  it('should activate and deactivate stock', () => {
    estoque.desativar();
    expect(estoque.ativo).toBe(false);

    estoque.ativar();
    expect(estoque.ativo).toBe(true);
  });

  it('should have unique ID', () => {
    const estoque2 = Estoque.create({
      produtos: [],
      nome: 'Outro Estoque',
    });

    expect(estoque.id.equals(estoque2.id)).toBe(false);
  });
});
