import { describe, it, expect } from 'vitest';
import { Quantidade } from '../quantidade';

describe('Quantidade', () => {
  it('should create a valid quantity', () => {
    const quantidade = new Quantidade(10);

    expect(quantidade.valor).toBe(10);
  });

  it('should round down to integer', () => {
    const quantidade = new Quantidade(10.7);

    expect(quantidade.valor).toBe(10);
  });

  it('should throw error for negative quantity', () => {
    expect(() => new Quantidade(-5)).toThrow('Quantidade não pode ser negativa');
  });

  it('should add two quantities', () => {
    const quantidade1 = new Quantidade(10);
    const quantidade2 = new Quantidade(5);

    const resultado = quantidade1.somar(quantidade2);

    expect(resultado.valor).toBe(15);
  });

  it('should subtract quantities', () => {
    const quantidade1 = new Quantidade(10);
    const quantidade2 = new Quantidade(3);

    const resultado = quantidade1.subtrair(quantidade2);

    expect(resultado.valor).toBe(7);
  });

  it('should throw error when subtraction results in negative quantity', () => {
    const quantidade1 = new Quantidade(5);
    const quantidade2 = new Quantidade(10);

    expect(() => quantidade1.subtrair(quantidade2)).toThrow(
      'Quantidade resultante não pode ser negativa'
    );
  });

  it('should multiply quantity by factor', () => {
    const quantidade = new Quantidade(10);

    const resultado = quantidade.multiplicar(2.5);

    expect(resultado.valor).toBe(25);
  });

  it('should check if quantity is zero', () => {
    const quantidadeZero = new Quantidade(0);
    const quantidadeNaoZero = new Quantidade(5);

    expect(quantidadeZero.isZero()).toBe(true);
    expect(quantidadeNaoZero.isZero()).toBe(false);
  });

  it('should compare quantities correctly', () => {
    const quantidade1 = new Quantidade(10);
    const quantidade2 = new Quantidade(5);
    const quantidade3 = new Quantidade(15);

    expect(quantidade1.isMaiorQue(quantidade2)).toBe(true);
    expect(quantidade1.isMenorQue(quantidade3)).toBe(true);
    expect(quantidade1.isMaiorQue(quantidade3)).toBe(false);
  });

  it('should check equality correctly', () => {
    const quantidade1 = new Quantidade(10);
    const quantidade2 = new Quantidade(10);
    const quantidade3 = new Quantidade(11);

    expect(quantidade1.equals(quantidade2)).toBe(true);
    expect(quantidade1.equals(quantidade3)).toBe(false);
  });

  it('should format quantity as string', () => {
    const quantidade = new Quantidade(10);

    expect(quantidade.toString()).toBe('10');
  });
});
