import { OrderStatus } from "@domain/value-objects/OrderStatus";

export class OrderEntity {
  private readonly status: OrderStatus;
  private readonly clientKey: string;
  private readonly amount: number;
  private readonly productList: string[];
  id: string | undefined;

  constructor(
    status: OrderStatus,
    clientKey: string,
    amount: number,
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

  getProductList() {
    return this.productList;
  }
}
