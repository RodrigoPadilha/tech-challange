import { Either, left, right } from "src/shared/either";
import { IOrderRepository } from "./ports/IOrderRepository";
import { OrderEntity } from "@domain/entities/OrderEntity";
import { ListOrderError, OrderCheckoutError } from "@adapters/Driven/errors";
import { OrderStatus } from "@domain/value-objects/OrderStatus";

interface Input {
  orderId: string;
}

export class CheckoutOrderUseCase {
  constructor(private readonly repository: IOrderRepository) {}
  async execute(
    input: Input
  ): Promise<Either<OrderCheckoutError | ListOrderError, OrderEntity>> {
    const orderOutput = await this.repository.list({ id: input.orderId });
    if (orderOutput.isLeft()) {
      return left(orderOutput.value);
    }

    const orderEntities = orderOutput.value as OrderEntity[];
    if (orderEntities.length > 1) {
      return left(new OrderCheckoutError(input.orderId));
    }

    const newOrderStatusOutput = OrderStatus.create("Recebido");
    if (newOrderStatusOutput.isLeft()) {
      return left(newOrderStatusOutput.value);
    }

    const orderEntity = orderEntities[0];
    const newOrderEntity = new OrderEntity(
      newOrderStatusOutput.value,
      orderEntity.getClientKey(),
      orderEntity.getTotalAmount(),
      orderEntity.getProducts(),
      orderEntity.id
    );
    const updateOutput = await this.repository.update(newOrderEntity);
    if (updateOutput.isLeft()) {
      return left(updateOutput.value);
    }
    return right(newOrderEntity);
  }
}
