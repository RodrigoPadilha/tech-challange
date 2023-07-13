import {
  IOrderRepository,
  OrderFilter,
} from "@application/ports/IOrderRepository";
import { OrderEntity } from "@domain/entities/OrderEntity";
import { Either, left, right } from "src/shared/either";
import {
  SaveOrderError,
  ListOrderError,
  OrderNotFoundError,
  UpdateOrderError,
} from "./errors";
import { IConnectionDatabase } from "@application/ports/IConnectionDatabase";
import {
  PrismaClient,
  OrderStatus as OrderStatusPrisma,
  Category as CategoryPrisma,
} from "@prisma/client";
import { PrismaConnection } from "@adapters/Driver/PrismaConnection";
import { OrderStatus } from "@domain/value-objects/OrderStatus";
import { Price } from "@domain/value-objects/Price";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { Category } from "@domain/value-objects/Category";

export class OrderDatabaseRepository implements IOrderRepository {
  private connection: IConnectionDatabase;
  private prisma: PrismaClient;

  constructor(connection: IConnectionDatabase) {
    this.connection = connection;
    this.prisma = (connection as PrismaConnection).getConnection();
  }

  async save(
    newOrder: OrderEntity
  ): Promise<Either<SaveOrderError, OrderEntity>> {
    try {
      await this.connection.connect();
      const clientData = await this.prisma.client.findUnique({
        where: { key: newOrder.getClientKey() },
      });
      const createdOrder = await this.prisma.order.create({
        data: {
          status: OrderStatusPrisma[
            newOrder.getStatus().getValue()
          ] as OrderStatusPrisma,
          client_id: clientData.id,
          total_amount: newOrder.getTotalAmount().getValue(),
          products: {
            create: newOrder.getProducts().map((product) => ({
              category: CategoryPrisma[product.getCategory()] as CategoryPrisma,
              description: product.getDescription(),
              price: product.getPrice(),
            })),
          },
        },
      });
      newOrder.id = createdOrder.id;
      return right(newOrder);
    } catch (error) {
      console.log("===> ERROR", error);
      return left(new SaveOrderError(error));
    } finally {
      await this.connection.disconnect();
    }
  }

  async list(
    filter?: OrderFilter
  ): Promise<Either<ListOrderError, OrderEntity[]>> {
    try {
      await this.connection.connect();
      const ordersData = await this.prisma.order.findMany({
        where: {
          id: filter?.id,
        },
        include: {
          products: {
            select: {
              id: true,
              description: true,
              category: true,
              price: true,
            },
          },
          client: { select: { key: true } },
        },
      });

      const ordersEntities = ordersData.map((order) => {
        //MAP PRODUCT
        const products = order.products.map((product) => {
          const priceOutput = Price.create(
            new Intl.NumberFormat("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(product.price)
          );
          const categoryOutput = Category.create(product.category);
          const price = priceOutput.value as Price;
          const category = categoryOutput.value as Category;
          const productEntity = new ProductEntity(
            product.description,
            price,
            category,
            product.id
          );
          return productEntity;
        });

        //MAP ORDER
        const orderStatusOutput = OrderStatus.create(order.status);
        const totalAmountOutput = Price.create(
          new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(order.total_amount)
        );
        const orderStatus = orderStatusOutput.value as OrderStatus;
        const totalAmount = totalAmountOutput.value as Price;
        const orderEntity = new OrderEntity(
          orderStatus,
          order.client.key,
          totalAmount,
          products,
          order.id
        );

        return orderEntity;
      });
      return right(ordersEntities);
    } catch (error) {
      console.log("===> ERROR", error);
      return left(new ListOrderError(error));
    } finally {
      await this.connection.disconnect();
    }
  }

  async update(
    newOrder: OrderEntity
  ): Promise<Either<OrderNotFoundError | UpdateOrderError, OrderEntity>> {
    try {
      const orderFound = await this.prisma.order.findUnique({
        where: { id: newOrder.id },
      });
      if (!orderFound) {
        return left(new OrderNotFoundError(newOrder.id));
      }
      await this.prisma.order.update({
        where: { id: newOrder.id },
        data: {
          status: OrderStatusPrisma[
            newOrder.getStatus().getValue()
          ] as OrderStatusPrisma,
          total_amount: newOrder.getTotalAmount().getValue(),
          products: {
            upsert: newOrder.getProducts().map((product) => ({
              create: {
                id: product.id,
                description: product.getDescription(),
                category: CategoryPrisma[
                  product.getCategory()
                ] as CategoryPrisma,
                price: product.getPrice(),
              },
              update: {
                description: product.getDescription(),
                category: CategoryPrisma[
                  product.getCategory()
                ] as CategoryPrisma,
                price: product.getPrice(),
              },
              where: { id: product.id },
            })),
          },
        },
      });

      return right(newOrder);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new UpdateOrderError(error));
    }
  }
}
