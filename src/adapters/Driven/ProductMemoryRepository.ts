import { v4 as uuidv4 } from "uuid";
import {
  IProductRepository,
  ProductFilter,
} from "@application/ports/IProductRepository";
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
import { Price } from "@domain/value-objects/Price";

export class ProductMemoryRepository implements IProductRepository {
  private products: ProductEntity[];

  constructor() {
    this.products = [
      new ProductEntity(
        "Xis Salada",
        Price.create("18,50").value as Price,
        Category.create("Lanche").value as Category,
        "1"
      ),
      new ProductEntity(
        "Xis Casa",
        Price.create("25,90").value as Price,
        Category.create("Lanche").value as Category,
        "2"
      ),
      new ProductEntity(
        "Coca-cola 2L",
        Price.create("8,50").value as Price,
        Category.create("Bebida").value as Category,
        "3"
      ),
    ];
  }

  async save(
    newProduct: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>> {
    try {
      newProduct.id = uuidv4();
      this.products.push(newProduct);
      return right(newProduct);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new SaveProductError(error));
    }
  }

  async list(
    filter?: ProductFilter
  ): Promise<Either<ListProductError, ProductEntity[]>> {
    try {
      if (!filter) {
        return right(this.products);
      }

      const productsFiltered = this.products.filter((product) => {
        if (
          filter.category &&
          product.getCategory().includes(filter.category.getValue())
        ) {
          return true;
        }
        return false;
      });
      return right(productsFiltered);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new ListProductError(error));
    }
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

  async getProductsByIds(
    productIds: string[]
  ): Promise<Either<ProductNotFoundError, ProductEntity[]>> {
    try {
      const productList: ProductEntity[] = [];
      for (const productId of productIds) {
        const productFound = this.products.find(
          (product) => product.id === productId
        );
        if (!productFound) {
          return left(new ProductNotFoundError(productId));
        }
        productList.push(productFound);
      }

      return right(productList);
    } catch (error) {
      return left(new ListProductError());
    }
  }
}
