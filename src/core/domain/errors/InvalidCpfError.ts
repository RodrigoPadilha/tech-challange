export class InvalidCpfError extends Error {
  constructor(cpf: string) {
    super(`Invalid cpf: ${cpf}`);
    this.name = "InvalidCpfError";
  }
}
