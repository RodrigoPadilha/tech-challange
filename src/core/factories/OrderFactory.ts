import IHttpServer from "@application/ports/IHttpServer";
import { OrderMemoryRepository } from "@adapters/Driven/OrderMemoryRepository";
import { OrderController } from "../infra/api/controllers/OrderController";
import { ListOrdersUseCase } from "@application/ListOrdersUseCase";
import { CreateOrderUseCase } from "@application/CreateOrderUseCase";
import { ProductMemoryRepository } from "@adapters/Driven/ProductMemoryRepository";
import { CheckoutOrderUseCase } from "@application/CheckoutOrderUseCase";
import { UpdateOrderUseCase } from "@application/UpdateOrderUseCase";

export class OrderFactory {
  private readonly orderController: OrderController;
  private readonly orderRepository: OrderMemoryRepository;
  private readonly productRepository: ProductMemoryRepository;

  constructor(private readonly httpServer: IHttpServer) {
    this.orderController = new OrderController(this.httpServer);
    this.orderRepository = new OrderMemoryRepository();
    this.productRepository = new ProductMemoryRepository();
  }

  makeListOrderController = () => {
    this.orderController.registerEndpointListOrders(
      new ListOrdersUseCase(this.orderRepository)
    );
  };

  makeCreateOrderController = () => {
    this.orderController.registerEndpointCreateOrder(
      new CreateOrderUseCase(this.orderRepository, this.productRepository)
    );
  };

  makeUpdateOrderController = () => {
    this.orderController.registerEndpointUpdateOrder(
      new UpdateOrderUseCase(this.orderRepository)
    );
  };

  makeCheckoutOrderController = () => {
    this.orderController.registerEndpointCheckoutOrder(
      new CheckoutOrderUseCase(this.orderRepository)
    );
  };
}
