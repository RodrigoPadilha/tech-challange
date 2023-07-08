import { CategoryType } from "@domain/value-objects/Category";

export class InvalidCategoryError extends Error {
  constructor(category: string) {
    super(
      `Categoria '${category}' não é inválida. Categorias válidas: ${Object.values(
        CategoryType
      ).join(", ")}`
    );
    this.name = "InvalidCategoryError";
  }
}
