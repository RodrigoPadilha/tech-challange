import IHttpServer from "@application/ports/IHttpServer";
import { ClientFactory } from "../../factories/ClientFactory";

export default class Router {
  constructor(readonly httpServer: IHttpServer) {}

  start() {
    console.log("> [Router] starting...");

    const clientFactory = new ClientFactory(this.httpServer);
    clientFactory.makeCreateClientController();
    clientFactory.makeListAllClientsController();
    //clientController.registerEndpointGetClientById();
  }
}
