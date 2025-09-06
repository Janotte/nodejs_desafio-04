// Configuração global para os testes
import { vi } from 'vitest';

// Mock do crypto para UniqueEntityId
vi.mock('crypto', () => ({
  randomUUID: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

// Configurações globais para testes
global.console = {
  ...console,
  // Silencia logs durante os testes para manter a saída limpa
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
