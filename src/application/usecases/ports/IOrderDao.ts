import { OrderEntity } from "@application/entities/OrderEntity";
import {
  ListOrderError,
  OrderNotFoundError,
  SaveOrderError,
  UpdateOrderError,
} from "src/dao/errors";
import { Either } from "src/shared/either";

export interface OrderFilter {
  id?: string;
}

export interface IOrderDao {
  save(newOrder: OrderEntity): Promise<Either<SaveOrderError, OrderEntity>>;

  list(filter?: OrderFilter): Promise<Either<ListOrderError, OrderEntity[]>>;

  update(
    newOrder: OrderEntity
  ): Promise<Either<OrderNotFoundError | UpdateOrderError, OrderEntity>>;
}
