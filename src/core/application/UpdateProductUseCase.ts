import { ProductNotFoundError } from "@adapters/Driven/errors";
import { IProductRepository } from "./ports/IProductRepository";
import { Either, left, right } from "src/shared/either";
import { UpdateProductError } from "@adapters/Driven/errors/UpdateProductError";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { Price } from "@domain/value-objects/Price";
import { Category } from "@domain/value-objects/Category";

interface Input {
  price: string;
  description: string;
  category: string;
  id: string;
}

export class UpdateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(
    input: Input
  ): Promise<Either<ProductNotFoundError | UpdateProductError, ProductEntity>> {
    const priceOutput = Price.create(input.price);
    if (priceOutput.isLeft()) {
      return left(priceOutput.value);
    }
    const categoryOutput = Category.create(input.category);
    if (categoryOutput.isLeft()) {
      return left(categoryOutput.value);
    }
    const { id, description } = input;
    const price = priceOutput.value as Price;
    const category = categoryOutput.value as Category;
    const productEntity = new ProductEntity(description, price, category, id);
    const updateEntityOutput = await this.repository.update(productEntity);
    if (updateEntityOutput.isLeft()) {
      return left(updateEntityOutput.value);
    }
    return right(productEntity);
  }
}
