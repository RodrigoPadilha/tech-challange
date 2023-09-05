import IHttpServer from "@adapters/ports/IHttpServer";
import { OrderController } from "../controllers/OrderController";
import { ListOrdersUseCase } from "@application/usecases/ListOrdersUseCase";
import { CreateOrderUseCase } from "@application/usecases/CreateOrderUseCase";
import { CheckoutOrderUseCase } from "@application/usecases/CheckoutOrderUseCase";
import { UpdateOrderUseCase } from "@application/usecases/UpdateOrderUseCase";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { OrderDao } from "src/dao/OrderDao";
import { ProductDao } from "src/dao/ProductDao";

export class OrderFactory {
  private readonly orderController: OrderController;
  private readonly orderDao: OrderDao;
  private readonly productDao: ProductDao;

  constructor(
    private readonly httpServer: IHttpServer,
    private readonly connection: IConnectionDatabase
  ) {
    this.orderController = new OrderController(this.httpServer);
    this.orderDao = new OrderDao(this.connection);
    this.productDao = new ProductDao(this.connection);
  }

  makeListOrderController = () => {
    this.orderController.registerEndpointListOrders(
      new ListOrdersUseCase(this.orderDao)
    );
  };

  makeCreateOrderController = () => {
    this.orderController.registerEndpointCreateOrder(
      new CreateOrderUseCase(this.orderDao, this.productDao)
    );
  };

  makeUpdateOrderController = () => {
    this.orderController.registerEndpointUpdateOrder(
      new UpdateOrderUseCase(this.orderDao)
    );
  };

  makeCheckoutOrderController = () => {
    this.orderController.registerEndpointCheckoutOrder(
      new CheckoutOrderUseCase(this.orderDao)
    );
  };
}
