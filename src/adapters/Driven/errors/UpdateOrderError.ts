export class UpdateOrderError extends Error {
  constructor(data?: any) {
    super(`Erro ao atualizar o pedido ${data}`);
    this.name = "UpdateOrderError";
  }
}
