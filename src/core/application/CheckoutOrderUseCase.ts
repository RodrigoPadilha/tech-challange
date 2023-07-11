import { Either, left, right } from "src/shared/either";
import { IOrderRepository } from "./ports/IOrderRepository";
import { OrderEntity } from "@domain/entities/OrderEntity";
import {
  ListOrderError,
  OrderDuplicateError,
  OrderNotFoundError,
  UpdateOrderError,
} from "@adapters/Driven/errors";
import { OrderStatus } from "@domain/value-objects/OrderStatus";

interface Input {
  orderId: string;
}

type TypeOrderErrors =
  | ListOrderError
  | OrderDuplicateError
  | OrderNotFoundError
  | UpdateOrderError;

export class CheckoutOrderUseCase {
  constructor(private readonly repository: IOrderRepository) {}
  async execute(input: Input): Promise<Either<TypeOrderErrors, OrderEntity>> {
    const listOrderOutput = await this.repository.list({ id: input.orderId });
    if (listOrderOutput.isLeft()) {
      return left(listOrderOutput.value);
    }

    const orderEntities = listOrderOutput.value as OrderEntity[];
    if (orderEntities.length > 1) {
      return left(new OrderDuplicateError(input.orderId));
    }

    const newOrderStatusOutput = OrderStatus.create("Recebido");
    if (newOrderStatusOutput.isLeft()) {
      return left(newOrderStatusOutput.value);
    }

    const currentOrderEntity = orderEntities[0];
    const newOrderEntity = new OrderEntity(
      newOrderStatusOutput.value,
      currentOrderEntity.getClientKey(),
      currentOrderEntity.getTotalAmount(),
      currentOrderEntity.getProducts(),
      currentOrderEntity.id
    );
    const updateOutput = await this.repository.update(newOrderEntity);
    if (updateOutput.isLeft()) {
      return left(updateOutput.value);
    }
    return right(newOrderEntity);
  }
}