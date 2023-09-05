import { ProductNotFoundError } from "src/dao/errors";
import { IProductDao } from "@application/usecases/ports/IProductDao";
import { Either, left, right } from "src/shared/either";
import { UpdateProductError } from "src/dao/errors/UpdateProductError";
import { ProductEntity } from "@application/entities/ProductEntity";
import { Price } from "@application/value-objects/Price";
import { Category } from "@application/value-objects/Category";

interface Input {
  price: string;
  description: string;
  category: string;
  id: string;
}

export class UpdateProductUseCase {
  constructor(private readonly dao: IProductDao) {}

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
    const updateEntityOutput = await this.dao.update(productEntity);
    if (updateEntityOutput.isLeft()) {
      return left(updateEntityOutput.value);
    }
    return right(productEntity);
  }
}
