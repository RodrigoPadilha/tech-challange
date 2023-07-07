export class InvalidCategoryError extends Error {
  constructor(category: string) {
    super(`Categoria inválido: ${category}`);
    this.name = "InvalidCategoryError";
  }
}
