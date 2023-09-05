export class ProductNotFoundError extends Error {
  constructor(data?: any) {
    super(`Produto ${data} não encontrado.`);
    this.name = "ProductNotFoundError";
  }
}
