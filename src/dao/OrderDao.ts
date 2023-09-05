import { IOrderDao, OrderFilter } from "@application/usecases/ports/IOrderDao";
import { OrderEntity } from "@application/entities/OrderEntity";
import { Either, left, right } from "src/shared/either";
import {
  SaveOrderError,
  ListOrderError,
  OrderNotFoundError,
  UpdateOrderError,
} from "./errors";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { OrderStatus } from "@application/value-objects/OrderStatus";
import { Price } from "@application/value-objects/Price";
import { ProductEntity } from "@application/entities/ProductEntity";
import { Category } from "@application/value-objects/Category";

export class OrderDao implements IOrderDao {
  private connection: IConnectionDatabase;

  constructor(connection: IConnectionDatabase) {
    this.connection = connection;
  }

  async save(
    newOrder: OrderEntity
  ): Promise<Either<SaveOrderError, OrderEntity>> {
    try {
      await this.connection.connect();
      const createdOrder = await this.connection.saveOrder(newOrder);
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
      const ordersData = await this.connection.listOrders(filter);
      const ordersEntities = ordersData.map((order) => {
        //MAP PRODUCT
        const productOrders = order.products.map((product) => {
          const priceOutput = Price.create(
            new Intl.NumberFormat("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(product.product.price)
          );
          const categoryOutput = Category.create(product.product.category);
          const price = priceOutput.value as Price;
          const category = categoryOutput.value as Category;
          const productEntity = new ProductEntity(
            product.product.description,
            price,
            category,
            product.product.id
          );
          return { product: productEntity, quantity: product.quantity };
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
          productOrders,
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
      const orderFound = await this.connection.findOrderById(newOrder.id);
      if (!orderFound) {
        return left(new OrderNotFoundError(newOrder.id));
      }
      const orderUpdated = await this.connection.updateOrder(newOrder);
      return right(newOrder);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new UpdateOrderError(error));
    }
  }
}
