import { describe, it, expect } from 'vitest';
import { Preco } from '../preco';

describe('Preco', () => {
  it('should create a valid price', () => {
    const preco = new Preco(10.5);

    expect(preco.valor).toBe(10.5);
    expect(preco.moeda).toBe('BRL');
  });

  it('should create a price with custom currency', () => {
    const preco = new Preco(25.99, 'USD');

    expect(preco.valor).toBe(25.99);
    expect(preco.moeda).toBe('USD');
  });

  it('should round to 2 decimal places', () => {
    const preco = new Preco(10.555);

    expect(preco.valor).toBe(10.56);
  });

  it('should throw error for negative price', () => {
    expect(() => new Preco(-10)).toThrow('Preço não pode ser negativo');
  });

  it('should add two prices with same currency', () => {
    const preco1 = new Preco(10.5);
    const preco2 = new Preco(5.25);

    const resultado = preco1.somar(preco2);

    expect(resultado.valor).toBe(15.75);
    expect(resultado.moeda).toBe('BRL');
  });

  it('should throw error when adding prices with different currencies', () => {
    const preco1 = new Preco(10.5, 'BRL');
    const preco2 = new Preco(5.25, 'USD');

    expect(() => preco1.somar(preco2)).toThrow('Não é possível somar preços de moedas diferentes');
  });

  it('should multiply price by factor', () => {
    const preco = new Preco(10.5);

    const resultado = preco.multiplicar(2);

    expect(resultado.valor).toBe(21.0);
    expect(resultado.moeda).toBe('BRL');
  });

  it('should check equality correctly', () => {
    const preco1 = new Preco(10.5);
    const preco2 = new Preco(10.5);
    const preco3 = new Preco(10.51);

    expect(preco1.equals(preco2)).toBe(true);
    expect(preco1.equals(preco3)).toBe(false);
  });

  it('should format price as string', () => {
    const preco = new Preco(10.5);

    expect(preco.toString()).toBe('BRL 10.50');
  });
});
