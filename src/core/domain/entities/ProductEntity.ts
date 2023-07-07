import { Category } from "@domain/value-objects/Category";

export class ProductEntity {
  private readonly category: Category;

  constructor(category: Category) {
    this.category = category;
  }

  getCategory() {
    return this.category.getValue();
  }
}
