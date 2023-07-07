import { InvalidCategoryError } from "@domain/errors";
import { Either, left, right } from "src/shared/either";

export class Category {
  private readonly value: string;

  constructor(category: string) {
    this.value = category;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(value: string): Either<InvalidCategoryError, Category> {
    const validCategories = ["Lanche", "Acompanhamento", "Bebida", "Sobremesa"];
    if (!validCategories.includes(value)) {
      return left(new InvalidCategoryError(value));
    }
    return right(new Category(value));
  }
}
