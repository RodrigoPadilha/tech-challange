export class ListOrderError extends Error {
  constructor(data?: any) {
    super(`Erro ao listar pedidos. ${data}`);
    this.name = "ListOrderError";
  }
}
