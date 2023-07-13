import { Cpf } from "@domain/value-objects/Cpf";
import { Email } from "@domain/value-objects/Email";
import { v4 as uuidv4 } from "uuid";

export class ClientEntity {
  private readonly key: string;
  private readonly cpf: Cpf;
  private readonly name: string;
  private readonly email: Email;
  private readonly isAnonymous: boolean;

  constructor(cpf: Cpf, name: string, email: Email, key?: string) {
    this.cpf = cpf;
    this.name = name;
    this.email = email;
    this.isAnonymous = cpf.getValue().length === 0;
    this.key = key ? key : uuidv4();
  }

  getKey() {
    return this.key;
  }

  getCpf() {
    return this.cpf.getValue();
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email.getValue();
  }

  getIsAnonymous() {
    return this.isAnonymous;
  }
}
