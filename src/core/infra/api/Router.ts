import IHttpServer from "@application/ports/IHttpServer";
import { ClientFactory } from "../../factories/ClientFactory";
import { ProductFactory } from "src/core/factories/ProductFactory";

export default class Router {
  constructor(readonly httpServer: IHttpServer) {}

  start() {
    console.log("> [Router] starting...");

    const clientFactory = new ClientFactory(this.httpServer);
    clientFactory.makeCreateClientController();
    clientFactory.makeListAllClientsController();
    clientFactory.makeGetClientByCpf();

    const productFactory = new ProductFactory(this.httpServer);
    productFactory.makeListAllProductsController();
  }
}
