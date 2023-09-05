export class OrderDuplicateError extends Error {
  constructor(data?: any) {
    super(`Mais de uma ordem encontrada com o id ${data}`);
    this.name = "OrderDuplicateError";
  }
}
