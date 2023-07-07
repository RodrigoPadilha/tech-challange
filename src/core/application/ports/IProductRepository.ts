import { ProductEntity } from "@domain/entities/ProductEntity";
import { Either } from "src/shared/either";
import { ListProductError, SaveProductError } from "@adapters/Driven/errors";
import { Category } from "@domain/value-objects/Category";

export interface IProductRepository {
  save(
    product: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>>;
  list(): Promise<Either<ListProductError, ProductEntity[]>>;
  getBy(category: Category): Promise<ProductEntity>;
}
