# 🏪 Sistema de Gerenciamento de Estoque

Um sistema completo de gerenciamento de estoque construído com **Domain-Driven Design (DDD)** e **TypeScript**, seguindo as melhores práticas de arquitetura limpa e testes unitários.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Este projeto implementa um sistema de gerenciamento de estoque seguindo os princípios do **Domain-Driven Design (DDD)**, com foco na modelagem do domínio de negócio e separação clara de responsabilidades. O sistema foi desenvolvido para ser altamente testável, manutenível e extensível.

### Características Principais

- ✅ **Domain-Driven Design** - Modelagem centrada no domínio de negócio
- ✅ **Arquitetura Limpa** - Separação clara entre camadas
- ✅ **TypeScript** - Tipagem estática para maior segurança
- ✅ **Testes Unitários** - 130+ testes com 100% de cobertura
- ✅ **Value Objects** - Objetos imutáveis para valores de domínio
- ✅ **Entidades** - Objetos com identidade e ciclo de vida
- ✅ **Casos de Uso** - Lógica de aplicação isolada
- ✅ **Repositórios** - Abstração para persistência de dados

## 🏗️ Arquitetura

O projeto segue a arquitetura hexagonal (Ports and Adapters) com as seguintes camadas:

```
┌─────────────────────────────────────────────────────────────┐
│                    Camada de Aplicação                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Use Cases     │  │   Controllers   │  │   Services  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Camada de Domínio                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Entities   │  │ Value Objs  │  │   Domain Services   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                Repository Interfaces                    │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Camada de Infraestrutura                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Database   │  │   External  │  │   File System       │  │
│  │  Adapters   │  │   APIs      │  │   Adapters          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Funcionalidades

### 📦 Gestão de Produtos

- Criação e edição de produtos
- Controle de estoque em tempo real
- Categorização e classificação
- Controle de preços e custos
- Ativação/desativação de produtos

### 📊 Controle de Estoque

- Monitoramento de quantidades
- Alertas de estoque baixo
- Relatórios de movimentação
- Controle de estoque mínimo
- Histórico de alterações

### 🛒 Gestão de Vendas

- Registro de vendas
- Histórico de transações
- Cálculo de lucros e margens
- Relatórios de vendas
- Análise de performance

### 📋 Ordens de Compra

- Criação de pedidos
- Aprovação e envio
- Controle de status
- Integração com fornecedores
- Rastreamento de entregas

### 👥 Gestão de Fornecedores

- Cadastro de fornecedores
- Validação de CNPJ
- Controle de prazos de entrega
- Histórico de relacionamento
- Avaliação de performance

### 🔔 Sistema de Alertas

- Notificações de estoque baixo
- Alertas de produtos sem estoque
- Confirmações de pedidos
- Notificações de entregas
- Sistema de tentativas de envio

## 🛠️ Tecnologias

### Core

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime JavaScript
- **Vitest** - Framework de testes
- **Prettier** - Formatação de código
- **Husky** - Git hooks

### Arquitetura

- **Domain-Driven Design** - Padrão arquitetural
- **Clean Architecture** - Separação de responsabilidades
- **SOLID Principles** - Princípios de design
- **Repository Pattern** - Abstração de dados
- **Use Case Pattern** - Lógica de aplicação

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd 04-Desafio
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute os testes**

```bash
npm test
```

4. **Formate o código**

```bash
npm run format
```

## 🎮 Uso

### Exemplo Básico

```typescript
import { CriarProduto } from './src/domain/use-cases/criar-produto';
import { ProdutosRepository } from './src/domain/repositories/produtos-repository';

// Criar um produto
const criarProduto = new CriarProduto(produtosRepository);

const produto = await criarProduto.execute({
  nome: 'Camiseta Azul',
  cor: 'Azul',
  tamanho: 'M',
  preco: 29.9,
  quantidade: 100,
  quantidadeMinima: 10,
  categoria: 'Roupas',
});
```

### Exemplo de Venda

```typescript
import { RegistrarVenda } from './src/domain/use-cases/registrar-venda';

const registrarVenda = new RegistrarVenda(produtosRepository, historicoVendasRepository);

const venda = await registrarVenda.execute({
  produtoId: 'produto-123',
  quantidadeVendida: 2,
  precoUnitario: 29.9,
  clienteId: 'cliente-456',
  vendedorId: 'vendedor-789',
});
```

### Exemplo de Alerta

```typescript
import { Alerta } from './src/domain/entities/alerta';
import { Email } from './src/domain/value-objects/email';

const email = new Email('admin@loja.com');
const alerta = Alerta.criarAlertaEstoqueBaixo(
  email,
  produtoId,
  'Camiseta Azul',
  5, // quantidade atual
  10 // quantidade mínima
);
```

## 🧪 Testes

O projeto possui **130 testes unitários** cobrindo todas as funcionalidades:

### Executar Testes

```bash
# Todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Testes específicos
npx vitest src/domain/entities/__tests__/produto.spec.ts
```

### Cobertura de Testes

- ✅ **Value Objects** - 27 testes
- ✅ **Entidades** - 67 testes
- ✅ **Casos de Uso** - 36 testes
- ✅ **Total** - 130 testes

### Estrutura dos Testes

```
src/
├── domain/
│   ├── value-objects/__tests__/
│   │   ├── preco.spec.ts
│   │   ├── quantidade.spec.ts
│   │   └── email.spec.ts
│   ├── entities/__tests__/
│   │   ├── produto.spec.ts
│   │   ├── estoque.spec.ts
│   │   ├── alerta.spec.ts
│   │   ├── historico-vendas.spec.ts
│   │   ├── ordem-compra.spec.ts
│   │   └── fornecedor.spec.ts
│   └── use-cases/__tests__/
│       ├── criar-produto.spec.ts
│       ├── atualizar-estoque-produto.spec.ts
│       └── registrar-venda.spec.ts
└── test/
    ├── setup.ts
    └── README.md
```

## 📁 Estrutura do Projeto

```
src/
├── core/                          # Camada de infraestrutura compartilhada
│   ├── entities/
│   │   ├── entity.ts             # Classe base para entidades
│   │   └── unique-entity-id.ts   # Identificador único
│   └── types/
│       └── optional.ts           # Tipos utilitários
├── domain/                        # Camada de domínio
│   ├── entities/                  # Entidades de domínio
│   │   ├── produto.ts
│   │   ├── estoque.ts
│   │   ├── alerta.ts
│   │   ├── historico-vendas.ts
│   │   ├── ordem-compra.ts
│   │   └── fornecedor.ts
│   ├── value-objects/             # Objetos de valor
│   │   ├── preco.ts
│   │   ├── quantidade.ts
│   │   └── email.ts
│   ├── repositories/              # Interfaces de repositório
│   │   ├── produtos-repository.ts
│   │   ├── estoque-repository.ts
│   │   ├── alertas-repository.ts
│   │   ├── historico-vendas-repository.ts
│   │   ├── ordens-compra-repository.ts
│   │   └── fornecedores-repository.ts
│   └── use-cases/                 # Casos de uso
│       ├── criar-produto.ts
│       ├── atualizar-estoque-produto.ts
│       ├── verificar-estoque-baixo.ts
│       ├── registrar-venda.ts
│       ├── gerar-relatorio-vendas.ts
│       └── criar-ordem-compra.ts
└── test/                          # Configuração de testes
    ├── setup.ts
    └── README.md
```

## 🎯 Princípios DDD Aplicados

### 1. **Ubiquitous Language**

- Termos do domínio refletidos no código
- Nomes de classes e métodos expressivos
- Documentação alinhada com o negócio

### 2. **Bounded Context**

- Separação clara entre contextos
- Interfaces bem definidas
- Acoplamento baixo entre módulos

### 3. **Entities**

- Objetos com identidade única
- Ciclo de vida gerenciado
- Comportamento encapsulado

### 4. **Value Objects**

- Objetos imutáveis
- Identificados por valor
- Validação de domínio

### 5. **Aggregates**

- Consistência transacional
- Raiz de agregação clara
- Invariantes de domínio

### 6. **Domain Events**

- Comunicação entre contextos
- Desacoplamento temporal
- Auditoria e rastreamento

## 📈 Benefícios da Arquitetura

### Para Desenvolvedores

- **Código Limpo** - Fácil de entender e manter
- **Testabilidade** - Testes unitários abrangentes
- **Extensibilidade** - Fácil adição de novas funcionalidades
- **Reutilização** - Componentes bem definidos

### Para o Negócio

- **Confiabilidade** - Sistema robusto e estável
- **Manutenibilidade** - Mudanças seguras e controladas
- **Performance** - Otimizações pontuais
- **Escalabilidade** - Crescimento controlado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Contribuição

- Siga os princípios DDD
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes em 100%
- Use commits semânticos
- Documente mudanças significativas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- Desenvolvedor: **Sandro Janotte**
- E-mail: **sjanotte@gmail.com**
- LinkedIn: **[Sandro Janotte](https://www.linkedin.com/in/sandro-andr%C3%A9-janotte-2b022450/)**

## 🙏 Agradecimentos

- Rocketseat pela inspiração e desafio
- Comunidade DDD pelos conceitos e práticas
- Contribuidores do projeto

---

**Desenvolvido com ❤️ seguindo os princípios do Domain-Driven Design**
