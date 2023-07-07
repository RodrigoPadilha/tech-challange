export class InvalidCpfError extends Error {
  constructor(cpf: string) {
    super(`Cpf inválido: ${cpf}`);
    this.name = "InvalidCpfError";
  }
}
