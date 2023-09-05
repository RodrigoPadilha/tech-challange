import { InvalidCategoryError } from "@application/errors";
import { Either, left, right } from "src/shared/either";

export enum CategoryType {
  Lanche = "Lanche",
  Acompanhamento = "Acompanhamento",
  Bebida = "Bebida",
  Sobremesa = "Sobremesa",
}

export class Category {
  private readonly value: string;

  constructor(category: string) {
    this.value = category;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(value: string): Either<InvalidCategoryError, Category> {
    const validCategories: string[] = Object.values(CategoryType);
    if (!validCategories.includes(value)) {
      return left(new InvalidCategoryError(value));
    }
    return right(new Category(value));
  }
}
