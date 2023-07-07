import { ProductEntity } from "@domain/entities/ProductEntity";
import { Either } from "src/shared/either";
import {
  DeleteProductError,
  ListProductError,
  ProductNotFoundError,
  SaveProductError,
} from "@adapters/Driven/errors";
import { Category } from "@domain/value-objects/Category";

export interface IProductRepository {
  save(
    product: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>>;
  list(): Promise<Either<ListProductError, ProductEntity[]>>;
  getBy(category: Category): Promise<ProductEntity>;
  remove(
    id: string
  ): Promise<Either<ProductNotFoundError | DeleteProductError, ProductEntity>>;
}
