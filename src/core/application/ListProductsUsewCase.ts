import { Category } from "@domain/value-objects/Category";
import { IProductRepository } from "./ports/IProductRepository";
import { Either, left, right } from "src/shared/either";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { InvalidCategoryError } from "@domain/errors";
import { ListProductError } from "@adapters/Driven/errors";

interface Input {
  category: string | undefined;
}

export class ListProductsUseCase {
  constructor(private readonly repository: IProductRepository) {}
  async execute(
    input: Input
  ): Promise<Either<InvalidCategoryError | ListProductError, ProductEntity[]>> {
    const categoryOutput = input.category && Category.create(input.category);
    if (categoryOutput?.isLeft()) {
      return left(categoryOutput.value);
    }
    const productsOutput = await this.repository.list(
      categoryOutput
        ? { category: categoryOutput.value as Category }
        : undefined
    );
    if (productsOutput.isLeft()) {
      return left(productsOutput.value);
    }

    return right(productsOutput.value);
  }
}
