export class GetClientError extends Error {
  constructor(data?: any) {
    super(`Erro pesquisar clientes. ${data}`);
    this.name = "GetClientError";
  }
}
