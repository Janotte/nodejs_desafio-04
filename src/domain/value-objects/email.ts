export class Email {
  private readonly _valor: string;

  constructor(valor: string) {
    const valorTrimmed = valor.trim();

    if (!this.isValid(valorTrimmed)) {
      throw new Error('Email inválido');
    }

    this._valor = valorTrimmed.toLowerCase();
  }

  get valor(): string {
    return this._valor;
  }

  equals(email: Email): boolean {
    return this._valor === email._valor;
  }

  toString(): string {
    return this._valor;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
