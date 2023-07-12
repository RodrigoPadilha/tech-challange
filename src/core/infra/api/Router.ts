import IHttpServer from "@application/ports/IHttpServer";
import { ClientFactory } from "../../factories/ClientFactory";
import { ProductFactory } from "src/core/factories/ProductFactory";
import { OrderFactory } from "src/core/factories/OrderFactory";
import { IConnectionDatabase } from "@application/ports/IConnectionDatabase";

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

    const orderFactory = new OrderFactory(this.httpServer);
    orderFactory.makeListOrderController();
    orderFactory.makeCreateOrderController();
    orderFactory.makeUpdateOrderController();
    orderFactory.makeCheckoutOrderController();
  }
}
