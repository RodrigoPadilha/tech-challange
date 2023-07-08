export class OrderNotFoundError extends Error {
  constructor(data?: any) {
    super(`Pedido ${data} não encontrado.`);
    this.name = "OrderNotFoundError";
  }
}
