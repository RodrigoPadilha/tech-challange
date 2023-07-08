import { Either, left, right } from "src/shared/either";
import { IOrderRepository } from "./ports/IOrderRepository";
import { ListOrderError } from "@adapters/Driven/errors";
import { OrderEntity } from "@domain/entities/Order";

export class ListOrdersUseCase {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(): Promise<Either<ListOrderError, OrderEntity[]>> {
    const orderOutput = await this.repository.list();
    if (orderOutput.isLeft()) {
      return left(orderOutput.value);
    }
    return right(orderOutput.value);
  }
}
