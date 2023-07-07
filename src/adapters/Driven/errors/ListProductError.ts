export class ListProductError extends Error {
  constructor(data?: any) {
    super(`List product error. ${data && JSON.stringify(data)}`);
    this.name = "ListProductError";
  }
}
