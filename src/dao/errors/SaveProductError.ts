export class SaveProductError extends Error {
  constructor(data?: any) {
    super(`Erro ao salvar produto. ${data}`);
    this.name = "SaveProductError";
  }
}
