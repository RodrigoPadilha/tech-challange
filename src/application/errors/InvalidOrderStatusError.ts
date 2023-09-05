import { OrderStatusType } from "@application/value-objects/OrderStatus";

export class InvalidOrderStatusError extends Error {
  constructor(orderStatus: string) {
    super(
      `Status '${orderStatus}' não é válido. Status válidos: ${Object.values(
        OrderStatusType
      ).join(", ")}`
    );
    this.name = "InvalidOrderStatusError";
  }
}
