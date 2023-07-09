export class OrderCheckoutError extends Error {
  constructor(data?: any) {
    super(`Não foi possível efetuar o pagamento da ordem ${data}`);
    this.name = "OrderCheckoutError";
  }
}
