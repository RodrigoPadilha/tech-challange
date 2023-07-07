export class DeleteProductError extends Error {
  constructor(data?: any) {
    super(`Erro ao deletar produto. ${data}`);
    this.name = "DeleteProductError";
  }
}
