import { randomUUID } from 'crypto';

export class UniqueEntityId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  toString(): string {
    return this.value;
  }

  equals(id: UniqueEntityId): boolean {
    return this.value === id.value;
  }
}
