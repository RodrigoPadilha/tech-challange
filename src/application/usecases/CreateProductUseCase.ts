import { Category } from "@application/value-objects/Category";
import { IProductDao } from "@application/usecases/ports/IProductDao";
import { Either, left, right } from "src/shared/either";
import { ProductEntity } from "@application/entities/ProductEntity";
import { InvalidCategoryError } from "@application/errors";
import { SaveProductError } from "src/dao/errors";
import { Price } from "@application/value-objects/Price";

interface Input {
  description: string;
  price: string;
  category: string;
}

export class CreateProductUseCase {
  constructor(private readonly dao: IProductDao) {}
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
    const description = input.description;
    const price = priceOutput.value as Price;
    const category = categoryOutput.value as Category;
    const productEntity = new ProductEntity(description, price, category);
    const saveEntityOutput = await this.dao.save(productEntity);
    if (saveEntityOutput.isLeft()) {
      return left(saveEntityOutput.value);
    }
    return right(productEntity);
  }
}
