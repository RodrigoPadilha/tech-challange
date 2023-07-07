import { Category } from "@domain/value-objects/Category";
import { Price } from "@domain/value-objects/Price";

export class ProductEntity {
  private readonly desciption: string;
  private readonly category: Category;
  private readonly price: Price;

  constructor(desciption: string, price: Price, category: Category) {
    this.desciption = desciption;
    this.category = category;
    this.price = price;
  }

  getDescription() {
    return this.desciption;
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
