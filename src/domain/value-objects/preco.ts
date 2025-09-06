export class Preco {
  private readonly _valor: number;
  private readonly _moeda: string;

  constructor(valor: number, moeda: string = 'BRL') {
    if (valor < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    this._valor = Math.round(valor * 100) / 100; // Arredonda para 2 casas decimais
    this._moeda = moeda;
  }

  get valor(): number {
    return this._valor;
  }

  get moeda(): string {
    return this._moeda;
  }

  equals(preco: Preco): boolean {
    return this._valor === preco._valor && this._moeda === preco._moeda;
  }

  toString(): string {
    return `${this._moeda} ${this._valor.toFixed(2)}`;
  }

  // Métodos para operações com preços
  somar(preco: Preco): Preco {
    if (this._moeda !== preco._moeda) {
      throw new Error('Não é possível somar preços de moedas diferentes');
    }
    return new Preco(this._valor + preco._valor, this._moeda);
  }

  multiplicar(fator: number): Preco {
    return new Preco(this._valor * fator, this._moeda);
  }
}
