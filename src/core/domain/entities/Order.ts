import { OrderStatus } from "@domain/value-objects/OrderStatus";
import { Price } from "@domain/value-objects/Price";

export class OrderEntity {
  private readonly status: OrderStatus;
  private readonly clientKey: string;
  private readonly amount: Price;
  private readonly productList: string[];
  id: string | undefined;

  constructor(
    status: OrderStatus,
    clientKey: string,
    amount: Price,
    productList: string[]
  ) {
    this.status = status;
    this.clientKey = clientKey;
    this.amount = amount;
    this.productList = productList;
  }

  getStatus() {
    return this.status;
  }

  getClientKey() {
    return this.clientKey;
  }

  getAmount() {
    return this.amount;
  }

  getAmountFormated() {
    return this.amount.toString();
  }

  getProductList() {
    return this.productList;
  }
}
