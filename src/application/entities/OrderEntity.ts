import { OrderStatus } from "@application/value-objects/OrderStatus";
import { Price } from "@application/value-objects/Price";
import { ProductEntity } from "./ProductEntity";

export type ProductOrder = { product: ProductEntity; quantity: number };

export class OrderEntity {
  private readonly status: OrderStatus;
  private readonly clientKey: string;
  private readonly totalAmount: Price;
  private readonly products: ProductOrder[];
  id: string | undefined;

  constructor(
    status: OrderStatus,
    clientKey: string,
    totalAmount: Price,
    products: ProductOrder[],
    id?: string
  ) {
    this.status = status;
    this.clientKey = clientKey;
    this.totalAmount = totalAmount;
    this.products = products;
    this.id = id;
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
