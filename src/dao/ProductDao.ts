import {
  IProductDao,
  ProductFilter,
} from "@application/usecases/ports/IProductDao";
import { ProductEntity } from "@application/entities/ProductEntity";
import { Category } from "@application/value-objects/Category";
import { Either, left, right } from "src/shared/either";
import {
  SaveProductError,
  ListProductError,
  ProductNotFoundError,
  DeleteProductError,
  UpdateProductError,
} from "./errors";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { Price } from "@application/value-objects/Price";

export class ProductDao implements IProductDao {
  private connection: IConnectionDatabase;

  constructor(connection: IConnectionDatabase) {
    this.connection = connection;
  }

  async save(
    newProduct: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>> {
    try {
      await this.connection.connect();
      const createdProduct = await this.connection.saveProduct(newProduct);
      newProduct.id = createdProduct.id;
      return right(newProduct);
    } catch (error) {
      console.log("===> ERROR", error);
      return left(new SaveProductError(error));
    } finally {
      await this.connection.disconnect();
    }
  }

  async list(
    filter?: ProductFilter
  ): Promise<Either<ListProductError, ProductEntity[]>> {
    try {
      await this.connection.connect();
      const productsData = await this.connection.listProduct(filter);
      const productsEntities = productsData.map((product) => {
        const clientEntity = this.productEntityFactory(product);
        return clientEntity;
      });
      return right(productsEntities);
    } catch (error) {
      console.log("===> ERROR", error);
      return left(new ListProductError(error));
    } finally {
      await this.connection.disconnect();
    }
  }

  async remove(
    id: string
  ): Promise<Either<ProductNotFoundError | DeleteProductError, ProductEntity>> {
    try {
      await this.connection.connect();
      const productFound = await this.connection.findProductById(id);
      if (!productFound) {
        return left(new ProductNotFoundError(id));
      }
      await this.connection.removeProduct(id);
      const productEntity = this.productEntityFactory(productFound);
      return right(productEntity);
    } catch (error) {
      return left(new DeleteProductError());
    } finally {
      await this.connection.disconnect();
    }
  }

  async update(
    newProduct: ProductEntity
  ): Promise<Either<ProductNotFoundError | UpdateProductError, ProductEntity>> {
    try {
      await this.connection.connect();
      const productFound = await this.connection.findProductById(newProduct.id);
      if (!productFound) {
        return left(new ProductNotFoundError(newProduct.id));
      }
      const productUpdated = await this.connection.updateProduct(newProduct);
      const productEntity = this.productEntityFactory(productFound);
      return right(productEntity);
    } catch (error) {
      console.log("===> ERROR", error);
      return left(new UpdateProductError());
    } finally {
      await this.connection.disconnect();
    }
  }

  async getProductsByIds(
    productIds: string[]
  ): Promise<Either<ProductNotFoundError, ProductEntity[]>> {
    try {
      await this.connection.connect();
      const productsData = await this.connection.getProductsByIds(productIds);
      const productsEntity = productsData.map((productData) => {
        const productEntity = this.productEntityFactory(productData);
        return productEntity;
      });
      return right(productsEntity);
    } catch (error) {
      console.log("===> ERROR", error);
      return left(new ListProductError());
    } finally {
      await this.connection.disconnect();
    }
  }

  private productEntityFactory(dataEntity) {
    const priceOutput = Price.create(
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(dataEntity.price)
    );
    const categoryOutput = Category.create(dataEntity.category);
    const productEntity = new ProductEntity(
      dataEntity.description,
      priceOutput.value as Price,
      categoryOutput.value as Category,
      dataEntity.id
    );
    return productEntity;
  }
}
