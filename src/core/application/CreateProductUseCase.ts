import { Category } from "@domain/value-objects/Category";
import { IProductRepository } from "./ports/IProductRepository";
import { Either, left, right } from "src/shared/either";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { InvalidCategoryError } from "@domain/errors";
import { SaveProductError } from "@adapters/Driven/errors";
import { Price } from "@domain/value-objects/Price";

interface Input {
  description: string;
  price: string;
  category: string;
}

export class CreateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}
  async execute(
    input: Input
  ): Promise<Either<InvalidCategoryError | SaveProductError, ProductEntity>> {
    const priceOutput = Price.create(input.price);
    if (priceOutput.isLeft()) {
      return left(priceOutput.value);
    }
    const categoryOutput = Category.create(input.category);
    if (categoryOutput.isLeft()) {
      return left(categoryOutput.value);
    }
    const category = categoryOutput.value as Category;
    const price = priceOutput.value as Price;
    const productEntity = new ProductEntity(price, category);
    // const desciption = input.description;
    const saveEntityOutput = await this.repository.save(productEntity);
    if (saveEntityOutput.isLeft()) {
      return left(saveEntityOutput.value);
    }
    return right(productEntity);
  }
}
