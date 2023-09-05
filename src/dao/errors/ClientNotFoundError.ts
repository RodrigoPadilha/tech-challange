export class ClientNotFoundError extends Error {
  constructor(data?: any) {
    super(`Cliente ${data} não encontrado.`);
    this.name = "ClientNotFoundError";
  }
}
