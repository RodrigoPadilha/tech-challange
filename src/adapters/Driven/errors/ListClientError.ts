export class ListClientError extends Error {
  constructor(data?: any) {
    super(`Erro ao listar cliente. ${data}`);
    this.name = "ListClientError";
  }
}
