import { OrderEntity } from "@domain/entities/Order";
import {
  ListOrderError,
  OrderNotFoundError,
  SaveOrderError,
  UpdateOrderError,
} from "@adapters/Driven/errors";
import { Either } from "src/shared/either";

export interface IOrderRepository {
  save(order: OrderEntity): Promise<Either<SaveOrderError, OrderEntity>>;

  list(): Promise<Either<ListOrderError, OrderEntity[]>>;

  update(
    newOrder: OrderEntity
  ): Promise<Either<OrderNotFoundError | UpdateOrderError, OrderEntity>>;
}
