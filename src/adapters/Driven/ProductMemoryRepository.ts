import { IProductRepository } from "@application/ports/IProductRepository";
import { Either, left, right } from "src/shared/either";
import { ListProductError, SaveProductError } from "./errors";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { Category } from "@domain/value-objects/Category";

export class ProductMemoryRepository implements IProductRepository {
  private products: ProductEntity[];

  constructor() {
    this.products = [];
  }

  async save(
    product: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>> {
    try {
      this.products.push(product);
      return right(product);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new SaveProductError(error));
    }
  }

  async list(): Promise<Either<ListProductError, ProductEntity[]>> {
    try {
      return right(this.products);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new ListProductError(error));
    }
  }

  async getBy(category: Category): Promise<ProductEntity> {
    const product = this.products.find(
      (client) => client.getCategory() === category.getValue()
    );
    return product;
  }
}
