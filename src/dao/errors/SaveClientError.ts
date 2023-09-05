export class SaveClientError extends Error {
  constructor(data?: any) {
    super(`Erro ao salvar cliente. ${data}`);
    this.name = "SaveClientError";
  }
}
