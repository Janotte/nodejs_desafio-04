# Testes do Sistema de Gerenciamento de Estoque

Este diretório contém todos os testes do sistema de gerenciamento de estoque construído com Domain-Driven Design (DDD).

## Estrutura dos Testes

### Value Objects (`src/domain/value-objects/__tests__/`)

- `preco.spec.ts` - Testes para o Value Object Preco
- `quantidade.spec.ts` - Testes para o Value Object Quantidade
- `email.spec.ts` - Testes para o Value Object Email

### Entidades (`src/domain/entities/__tests__/`)

- `produto.spec.ts` - Testes para a entidade Produto
- `estoque.spec.ts` - Testes para a entidade Estoque
- `alerta.spec.ts` - Testes para a entidade Alerta
- `historico-vendas.spec.ts` - Testes para a entidade HistoricoVendas
- `ordem-compra.spec.ts` - Testes para a entidade OrdemCompra
- `fornecedor.spec.ts` - Testes para a entidade Fornecedor

### Casos de Uso (`src/domain/use-cases/__tests__/`)

- `criar-produto.spec.ts` - Testes para o caso de uso CriarProduto
- `atualizar-estoque-produto.spec.ts` - Testes para o caso de uso AtualizarEstoqueProduto
- `registrar-venda.spec.ts` - Testes para o caso de uso RegistrarVenda

## Executando os Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar testes específicos

```bash
# Testes de uma entidade específica
npx vitest src/domain/entities/__tests__/produto.spec.ts

# Testes de value objects
npx vitest src/domain/value-objects/__tests__/

# Testes de casos de uso
npx vitest src/domain/use-cases/__tests__/
```

## Cobertura de Testes

Os testes cobrem:

### ✅ Value Objects

- Validação de dados de entrada
- Operações matemáticas
- Comparações e igualdade
- Formatação de strings

### ✅ Entidades

- Criação e inicialização
- Métodos de domínio
- Validações de negócio
- Estados e transições
- Relacionamentos entre entidades

### ✅ Casos de Uso

- Fluxos de sucesso
- Tratamento de erros
- Validações de entrada
- Integração com repositórios
- Mocks e stubs

## Padrões de Teste Utilizados

### 1. **Arrange-Act-Assert (AAA)**

```typescript
it('should create product successfully', async () => {
  // Arrange - Preparar dados de teste
  const request = { nome: 'Produto', preco: 10.0 };

  // Act - Executar a ação
  const result = await criarProduto.execute(request);

  // Assert - Verificar o resultado
  expect(result.produto.nome).toBe('Produto');
});
```

### 2. **Mocks e Stubs**

```typescript
// Mock de repositório
const produtosRepository = {
  create: vi.fn(),
  findById: vi.fn(),
  // ... outros métodos
};
```

### 3. **Testes de Validação**

```typescript
it('should throw error for invalid data', () => {
  expect(() => new Preco(-10)).toThrow('Preço não pode ser negativo');
});
```

### 4. **Testes de Estado**

```typescript
it('should detect low stock', () => {
  produto.atualizarQuantidade(new Quantidade(5));
  expect(produto.estaComEstoqueBaixo()).toBe(true);
});
```

## Benefícios dos Testes

1. **Confiabilidade**: Garantem que o código funciona conforme esperado
2. **Documentação**: Servem como documentação viva do comportamento do sistema
3. **Refatoração Segura**: Permitem refatorar com confiança
4. **Detecção Precoce**: Identificam bugs antes da produção
5. **Qualidade**: Forçam a escrita de código mais limpo e testável

## Próximos Passos

Para expandir a cobertura de testes, considere adicionar:

1. **Testes de Integração**: Testar a integração entre camadas
2. **Testes de Performance**: Verificar performance de operações críticas
3. **Testes de Contrato**: Validar interfaces entre módulos
4. **Testes de Cenários Complexos**: Fluxos de negócio mais elaborados
5. **Testes de Edge Cases**: Casos extremos e situações inesperadas
