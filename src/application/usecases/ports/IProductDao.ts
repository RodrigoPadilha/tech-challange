import { ProductEntity } from "@application/entities/ProductEntity";
import { Either } from "src/shared/either";
import {
  DeleteProductError,
  ListProductError,
  ProductNotFoundError,
  SaveProductError,
} from "src/dao/errors";
import { Category } from "@application/value-objects/Category";
import { UpdateProductError } from "src/dao/errors/UpdateProductError";

export interface ProductFilter {
  category?: Category;
  id?: string;
}

export interface IProductDao {
  save(
    newProduct: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>>;

  list(
    filter?: ProductFilter
  ): Promise<Either<ListProductError, ProductEntity[]>>;

  remove(
    id: string
  ): Promise<Either<ProductNotFoundError | DeleteProductError, ProductEntity>>;

  update(
    newProduct: ProductEntity
  ): Promise<Either<ProductNotFoundError | UpdateProductError, ProductEntity>>;

  getProductsByIds(
    productIds: string[]
  ): Promise<Either<ProductNotFoundError, ProductEntity[]>>;
}
