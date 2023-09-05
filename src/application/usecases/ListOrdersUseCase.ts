import { Either, left, right } from "src/shared/either";
import { IOrderDao } from "@application/usecases/ports/IOrderDao";
import { ListOrderError } from "src/dao/errors";
import { OrderEntity } from "@application/entities/OrderEntity";

export class ListOrdersUseCase {
  constructor(private readonly dao: IOrderDao) {}

  async execute(): Promise<Either<ListOrderError, OrderEntity[]>> {
    const orderOutput = await this.dao.list();
    if (orderOutput.isLeft()) {
      return left(orderOutput.value);
    }
    return right(orderOutput.value);
  }
}
