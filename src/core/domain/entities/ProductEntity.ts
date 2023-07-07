import { Category } from "@domain/value-objects/Category";
import { Price } from "@domain/value-objects/Price";

export class ProductEntity {
  private readonly desciption: string;
  private readonly category: Category;
  private readonly price: Price;
  id: string | undefined;

  constructor(
    description: string,
    price: Price,
    category: Category,
    id?: string
  ) {
    this.desciption = description;
    this.category = category;
    this.price = price;
    this.id = id;
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
