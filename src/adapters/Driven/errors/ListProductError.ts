export class ListProductError extends Error {
  constructor(data?: any) {
    super(`Erro ao listar produto. ${data}`);
    this.name = "ListProductError";
  }
}
