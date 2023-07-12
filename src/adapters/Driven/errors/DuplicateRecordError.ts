export class DuplicateRecordError extends Error {
  constructor(data?: any) {
    super(`Cliente com o cpf ${data} já está cadastrado.`);
    this.name = "DuplicateRecordError";
  }
}
