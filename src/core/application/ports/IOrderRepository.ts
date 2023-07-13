import { OrderEntity } from "@domain/entities/OrderEntity";
import {
  ListOrderError,
  OrderNotFoundError,
  SaveOrderError,
  UpdateOrderError,
} from "@adapters/Driven/errors";
import { Either } from "src/shared/either";

export interface OrderFilter {
  id?: string;
}

export interface IOrderRepository {
  save(newOrder: OrderEntity): Promise<Either<SaveOrderError, OrderEntity>>;

  list(filter?: OrderFilter): Promise<Either<ListOrderError, OrderEntity[]>>;

  update(
    newOrder: OrderEntity
  ): Promise<Either<OrderNotFoundError | UpdateOrderError, OrderEntity>>;
}
