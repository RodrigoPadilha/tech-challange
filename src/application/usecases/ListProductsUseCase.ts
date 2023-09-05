import { Category } from "@application/value-objects/Category";
import { IProductDao } from "@application/usecases/ports/IProductDao";
import { Either, left, right } from "src/shared/either";
import { ProductEntity } from "@application/entities/ProductEntity";
import { InvalidCategoryError } from "@application/errors";
import { ListProductError } from "src/dao/errors";

interface Input {
  category: string | undefined;
}

export class ListProductsUseCase {
  constructor(private readonly dao: IProductDao) {}
  async execute(
    input: Input
  ): Promise<Either<InvalidCategoryError | ListProductError, ProductEntity[]>> {
    const categoryOutput = input.category && Category.create(input.category);
    if (categoryOutput?.isLeft()) {
      return left(categoryOutput.value);
    }
    const productsOutput = await this.dao.list(
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
