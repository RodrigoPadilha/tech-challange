import { v4 as uuidv4 } from "uuid";
import { IProductRepository } from "@application/ports/IProductRepository";
import { Either, left, right } from "src/shared/either";
import {
  DeleteProductError,
  ListProductError,
  ProductNotFoundError,
  SaveProductError,
} from "./errors";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { Category } from "@domain/value-objects/Category";
import { UpdateProductError } from "./errors/UpdateProductError";

export class ProductMemoryRepository implements IProductRepository {
  private products: ProductEntity[];

  constructor() {
    this.products = [];
  }

  async save(
    product: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>> {
    try {
      product.id = uuidv4();
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

  async remove(
    id: string
  ): Promise<Either<ProductNotFoundError | DeleteProductError, ProductEntity>> {
    try {
      const productFound = this.products.find((product) => product.id === id);
      if (!productFound) {
        return left(new ProductNotFoundError(id));
      }
      const newArray = this.products.filter((product) => product.id !== id);
      this.products = newArray;
      return right(productFound);
    } catch (error) {
      return left(new DeleteProductError());
    }
  }

  async update(
    newProduct: ProductEntity
  ): Promise<Either<ProductNotFoundError | UpdateProductError, ProductEntity>> {
    try {
      const productExists = this.products.some(
        (product) => product.id === newProduct.id
      );
      if (!productExists) {
        return left(new ProductNotFoundError(newProduct.id));
      }
      const index = this.products.findIndex(
        (productToUpdate) => productToUpdate.id === newProduct.id
      );
      if (index !== -1) {
        this.products.splice(index, 1, newProduct);
      }
      return right(newProduct);
    } catch (error) {
      return left(new UpdateProductError(newProduct.id));
    }
  }
}
