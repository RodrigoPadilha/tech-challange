export class InvalidPriceFormatError extends Error {
  constructor(price: string) {
    super(`Formato de preço inválido (9.999.999,99): ${price}`);
    this.name = "InvalidPriceFormatError";
  }
}
