import { Cpf } from "@domain/value-objects/Cpf";
import { v4 as uuidv4 } from "uuid";

export class ClientEntity {
  private readonly key: string;
  private readonly cpf: Cpf;

  constructor(cpf: Cpf) {
    this.key = uuidv4();
    this.cpf = cpf;
  }

  getKey() {
    return this.key;
  }

  getCpf() {
    return this.cpf.getValue();
  }
}
