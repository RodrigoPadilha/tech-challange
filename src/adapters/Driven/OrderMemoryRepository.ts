import { v4 as uuidv4 } from "uuid";
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

export class OrderMemoryRepository implements IOrderRepository {
  private orders: OrderEntity[];

  constructor() {
    this.orders = [];
  }

  async save(
    newOrder: OrderEntity
  ): Promise<Either<SaveOrderError, OrderEntity>> {
    try {
      newOrder.id = uuidv4();
      this.orders.push(newOrder);
      return right(newOrder);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new SaveOrderError(error));
    }
  }

  async list(
    filter?: OrderFilter
  ): Promise<Either<ListOrderError, OrderEntity[]>> {
    try {
      if (!filter) {
        return right(this.orders);
      }
      const ordersFiltered = this.orders.filter((order) => {
        if (filter.id && order.id === filter.id) {
          return true;
        }
        return false;
      });
      return right(ordersFiltered);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new ListOrderError(error));
    }
  }

  async update(
    newOrder: OrderEntity
  ): Promise<Either<OrderNotFoundError | UpdateOrderError, OrderEntity>> {
    try {
      const productExists = this.orders.some(
        (product) => product.id === newOrder.id
      );
      if (!productExists) {
        return left(new OrderNotFoundError(newOrder.id));
      }
      const index = this.orders.findIndex(
        (orderToUpdate) => orderToUpdate.id === newOrder.id
      );
      if (index !== -1) {
        this.orders.splice(index, 1, newOrder);
      }
      return right(newOrder);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new UpdateOrderError(error));
    }
  }
}
