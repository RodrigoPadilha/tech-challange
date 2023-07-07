import { Category } from "@domain/value-objects/Category";
import { Price } from "@domain/value-objects/Price";

export class ProductEntity {
  private readonly category: Category;
  private readonly price: Price;

  constructor(price: Price, category: Category) {
    this.category = category;
    this.price = price;
  }

  getPrice() {
    return this.price.getValue();
  }

  getPriceFormated() {
    return this.price.toString();
  }

  getCategory() {
    return this.category.getValue();
  }
}
