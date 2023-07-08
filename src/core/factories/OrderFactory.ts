import { OrderMemoryRepository } from "@adapters/Driven/OrderMemoryRepository";
import IHttpServer from "@application/ports/IHttpServer";
import { OrderController } from "../infra/api/controllers/OrderController";

export class OrderFactory {
  private readonly orderController: OrderController;
  private readonly orderRepository: OrderMemoryRepository;

  constructor(private readonly httpServer: IHttpServer) {
    this.orderController = new OrderController(this.httpServer);
    this.orderRepository = new OrderMemoryRepository();
  }
}
