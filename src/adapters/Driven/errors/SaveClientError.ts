export class SaveClientError extends Error {
  constructor(data?: any) {
    super(`Save client error. ${data}`);
    this.name = "SaveClientError";
  }
}
