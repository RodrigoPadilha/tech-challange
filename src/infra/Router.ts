import IHttpServer from "@adapters/ports/IHttpServer";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { ClientFactory } from "src/factories/ClientFactory";
import { ProductFactory } from "src/factories/ProductFactory";
import { OrderFactory } from "src/factories/OrderFactory";

export default class Router {
  constructor(
    readonly httpServer: IHttpServer,
    readonly connection: IConnectionDatabase
  ) {}

  start() {
    console.log("> [Router] starting...");

    const clientFactory = new ClientFactory(this.httpServer, this.connection);
    clientFactory.makeCreateClientController();
    clientFactory.makeListAllClientsController();
    clientFactory.makeGetClientByCpf();

    const productFactory = new ProductFactory(this.httpServer, this.connection);
    productFactory.makeListProductsController();
    productFactory.makeCreateProductController();
    productFactory.makeDeleteProductController();
    productFactory.makeUpdateProductController();

    const orderFactory = new OrderFactory(this.httpServer, this.connection);
    orderFactory.makeListOrderController();
    orderFactory.makeCreateOrderController();
    orderFactory.makeUpdateOrderController();
    orderFactory.makeCheckoutOrderController();
  }
}
