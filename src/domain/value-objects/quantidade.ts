export class Quantidade {
  private readonly _valor: number;

  constructor(valor: number) {
    if (valor < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    this._valor = Math.floor(valor); // Quantidade deve ser inteira
  }

  get valor(): number {
    return this._valor;
  }

  equals(quantidade: Quantidade): boolean {
    return this._valor === quantidade._valor;
  }

  toString(): string {
    return this._valor.toString();
  }

  // Métodos para operações com quantidades
  somar(quantidade: Quantidade): Quantidade {
    return new Quantidade(this._valor + quantidade._valor);
  }

  subtrair(quantidade: Quantidade): Quantidade {
    const resultado = this._valor - quantidade._valor;
    if (resultado < 0) {
      throw new Error('Quantidade resultante não pode ser negativa');
    }
    return new Quantidade(resultado);
  }

  multiplicar(fator: number): Quantidade {
    return new Quantidade(Math.floor(this._valor * fator));
  }

  isZero(): boolean {
    return this._valor === 0;
  }

  isMaiorQue(quantidade: Quantidade): boolean {
    return this._valor > quantidade._valor;
  }

  isMenorQue(quantidade: Quantidade): boolean {
    return this._valor < quantidade._valor;
  }
}
