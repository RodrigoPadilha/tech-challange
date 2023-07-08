export class ListClientError extends Error {
  constructor(data?: any) {
    super(`Erro ao listar clientes. ${data}`);
    this.name = "ListClientError";
  }
}
