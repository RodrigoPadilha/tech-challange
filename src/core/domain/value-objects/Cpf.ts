import { InvalidCpfError } from "@domain/errors";
import { Either, left, right } from "src/shared/either";

export class Cpf {
  private readonly value: string;

  constructor(cpf: string) {
    this.value = cpf;
  }

  public getValue(): string {
    return this.value;
  }

  private static isValidCpf(cpf: string) {
    return cpf.length === 8;
  }

  public static create(cpf: string): Either<InvalidCpfError, Cpf> {
    if (!this.isValidCpf(cpf)) {
      return right(new Cpf(cpf));
    }
    return left(new InvalidCpfError(cpf));
  }
}
