import { Either, left, right } from "src/shared/either";
import { IOrderRepository } from "./ports/IOrderRepository";
import { OrderEntity, ProductOrder } from "@domain/entities/OrderEntity";
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
    const orderStatusOutput = OrderStatus.create("Aguardando_pagamento");
    if (orderStatusOutput.isLeft()) {
      return left(orderStatusOutput.value);
    }

    const productsOutput = await this.productRepository.getProductsByIds(
      input.products
    );
    const productsEntities = productsOutput.value as ProductEntity[];

    const productOrdersMap = new Map<string, ProductOrder>();
    input.products.forEach((id) => {
      const matchingItems = productsEntities.find((item) => item.id === id);
      if (productOrdersMap.has(id)) {
        const productOrder = productOrdersMap.get(id);
        productOrder.quantity += 1;
      } else {
        productOrdersMap.set(id, { product: matchingItems, quantity: 1 });
      }
    });
    const productOrders = Array.from(productOrdersMap.values());
    const totalAmount = productOrders.reduce(
      (total, product) => total + product.product.getPrice() * product.quantity,
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
      productOrders
    );
    const orderSaveOutput = await this.orderRepository.save(order);
    if (orderSaveOutput.isLeft()) {
      return left(orderSaveOutput.value);
    }

    return right(order);
  }
}
