import { OrderStatus } from "@domain/value-objects/OrderStatus";
import { Price } from "@domain/value-objects/Price";
import { ProductEntity } from "./ProductEntity";

export class OrderEntity {
  private readonly status: OrderStatus;
  private readonly clientKey: string;
  private readonly totalAmount: Price;
  private readonly products: ProductEntity[];
  id: string | undefined;

  constructor(
    status: OrderStatus,
    clientKey: string,
    totalAmount: Price,
    products: ProductEntity[]
  ) {
    this.status = status;
    this.clientKey = clientKey;
    this.totalAmount = totalAmount;
    this.products = products;
  }

  getStatus() {
    return this.status;
  }

  getClientKey() {
    return this.clientKey;
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  getTotalAmountFormatted() {
    return this.totalAmount.toString();
  }

  getProducts() {
    return this.products;
  }
}
