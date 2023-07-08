export class SaveOrderError extends Error {
  constructor(data?: any) {
    super(`Erro ao salvar pedido. ${data}`);
    this.name = "SaveOrderError";
  }
}
