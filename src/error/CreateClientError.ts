export class CreateClientError extends Error {
  constructor(data?: any) {
    super(`Create client error. ${data}`);
    this.name = "CreateClientError";
  }
}
