import { CategoryType } from "@application/value-objects/Category";

export class InvalidCategoryError extends Error {
  constructor(category: string) {
    super(
      `Categoria '${category}' não é válida. Categorias válidas: ${Object.values(
        CategoryType
      ).join(", ")}`
    );
    this.name = "InvalidCategoryError";
  }
}
