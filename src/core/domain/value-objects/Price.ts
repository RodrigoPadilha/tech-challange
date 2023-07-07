import { InvalidPriceError, InvalidPriceFormatError } from "@domain/errors";
import { Either, left, right } from "src/shared/either";

export class Price {
  private readonly value: number;

  constructor(price: number) {
    this.value = price;
  }

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toFixed(2).replace(".", ",");
  }

  private static isValidPrice(numericValue: number) {
    if (isNaN(numericValue) || numericValue < 0) {
      return false;
    }
    return true;
  }

  public static create(price: string): Either<InvalidPriceError, Price> {
    const priceRegex = /^\d{1,3}(.\d{3})*,\d{2}$/;

    if (!priceRegex.test(price)) {
      return left(new InvalidPriceFormatError(price));
    }

    const numericValue = parseFloat(price.replace(".", "").replace(",", "."));
    if (!this.isValidPrice(numericValue)) {
      return left(new InvalidPriceError(price));
    }
    return right(new Price(numericValue));
  }
}
