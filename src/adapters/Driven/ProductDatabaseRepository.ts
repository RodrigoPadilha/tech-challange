import {
  IProductRepository,
  ProductFilter,
} from "@application/ports/IProductRepository";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { Category } from "@domain/value-objects/Category";
import { Either, left, right } from "src/shared/either";
import {
  SaveProductError,
  ListProductError,
  ProductNotFoundError,
  DeleteProductError,
} from "./errors";
import { UpdateProductError } from "./errors/UpdateProductError";
import { IConnectionDatabase } from "@application/ports/IConnectionDatabase";
import { PrismaClient, Category as CategoryPrisma } from "@prisma/client";
import { PrismaConnection } from "@adapters/Driver/PrismaConnection";
import { Price } from "@domain/value-objects/Price";

export class ProductDatabaseRepository implements IProductRepository {
  private connection: IConnectionDatabase;
  private prisma: PrismaClient;

  constructor(connection: IConnectionDatabase) {
    this.connection = connection;
    this.prisma = (connection as PrismaConnection).getConnection();
  }

  async save(
    newProduct: ProductEntity
  ): Promise<Either<SaveProductError, ProductEntity>> {
    try {
      await this.connection.connect();
      const createdProduct = await this.prisma.product.create({
        data: {
          description: newProduct.getDescription(),
          price: newProduct.getPrice(),
          category: CategoryPrisma[newProduct.getCategory()] as CategoryPrisma,
        },
      });
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
      const productsData = await this.prisma.product.findMany({
        where: {
          id: filter?.id,
          category: CategoryPrisma[
            filter?.category.getValue()
          ] as CategoryPrisma,
        },
      });
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
      const productFound = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!productFound) {
        return left(new ProductNotFoundError(id));
      }
      await this.prisma.product.delete({ where: { id } });
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
      const productFound = await this.prisma.product.findUnique({
        where: { id: newProduct.id },
      });
      if (!productFound) {
        return left(new ProductNotFoundError(newProduct.id));
      }
      const result = await this.prisma.product.update({
        data: {
          description: newProduct.getDescription(),
          price: newProduct.getPrice(),
          category: CategoryPrisma[newProduct.getCategory()] as CategoryPrisma,
        },
        where: { id: newProduct.id },
      });
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
      const productsData = await this.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

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
