export class InvalidPriceError extends Error {
  constructor(price: string) {
    super(`Preço inválido: ${price}`);
    this.name = "InvalidPriceError";
  }
}
