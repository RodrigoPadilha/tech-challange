export class UpdateProductError extends Error {
  constructor(data?: any) {
    super(`Erro ao atualizar o produto ${data}`);
    this.name = "UpdateProductError";
  }
}
