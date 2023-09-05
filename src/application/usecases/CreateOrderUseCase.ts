import { Either, left, right } from "src/shared/either";
import { IOrderDao } from "@application/usecases/ports/IOrderDao";
import { IProductDao } from "@application/usecases/ports/IProductDao";
import { OrderEntity, ProductOrder } from "@application/entities/OrderEntity";
import { SaveOrderError } from "src/dao/errors";
import { OrderStatus } from "@application/value-objects/OrderStatus";
import { ProductEntity } from "@application/entities/ProductEntity";
import { Price } from "@application/value-objects/Price";

interface Input {
  key: string;
  products: string[];
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderDao: IOrderDao,
    private readonly productDao: IProductDao
  ) {}

  async execute(input: Input): Promise<Either<SaveOrderError, OrderEntity>> {
    const orderStatusOutput = OrderStatus.create("Aguardando_pagamento");
    if (orderStatusOutput.isLeft()) {
      return left(orderStatusOutput.value);
    }

    const productsOutput = await this.productDao.getProductsByIds(
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
    const orderSaveOutput = await this.orderDao.save(order);
    if (orderSaveOutput.isLeft()) {
      return left(orderSaveOutput.value);
    }

    return right(order);
  }
}
