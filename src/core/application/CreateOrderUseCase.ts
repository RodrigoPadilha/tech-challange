import { Either, left, right } from "src/shared/either";
import { IOrderRepository } from "./ports/IOrderRepository";
import { OrderEntity } from "@domain/entities/OrderEntity";
import { SaveOrderError } from "@adapters/Driven/errors";
import { OrderStatus } from "@domain/value-objects/OrderStatus";
import { IProductRepository } from "./ports/IProductRepository";
import { ProductEntity } from "@domain/entities/ProductEntity";
import { Price } from "@domain/value-objects/Price";

interface Input {
  key: string;
  products: string[];
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(input: Input): Promise<Either<SaveOrderError, OrderEntity>> {
    const orderStatusOutput = OrderStatus.create("Aguardando pagamento");
    if (orderStatusOutput.isLeft()) {
      return left(orderStatusOutput.value);
    }

    const productsOutput = await this.productRepository.getProductsByIds(
      input.products
    );
    const productsEntities = productsOutput.value as ProductEntity[];

    const totalAmount = productsEntities.reduce(
      (total, product) => total + product.getPrice(),
      0
    );
    const totalPriceOutput = Price.create(
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalAmount)
    );
    if (totalPriceOutput.isLeft()) {
      return left(totalPriceOutput.value);
    }

    const orderStatus = orderStatusOutput.value as OrderStatus;
    const clientkey = input.key;
    const totalPrice = totalPriceOutput.value as Price;

    const order = new OrderEntity(
      orderStatus,
      clientkey,
      totalPrice,
      productsEntities
    );
    const orderSaveOutput = await this.orderRepository.save(order);
    if (orderSaveOutput.isLeft()) {
      return left(orderSaveOutput.value);
    }

    return right(order);
  }
}
