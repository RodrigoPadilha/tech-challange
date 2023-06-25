import IHttpServer from "@application/ports/IHttpServer";
import { ClientController } from "src/infra/api/controllers";
import { ListClientsUseCase } from "@application/ListClientsUseCase";
import { ClientMemoryRepository } from "@adapters/Driven/ClientMemoryRepository";

export default class Router {
  constructor(readonly httpServer: IHttpServer) {}

  start() {
    console.log("> [Router] starting...");

    const clientController = new ClientController(this.httpServer);

    const clientRepository = new ClientMemoryRepository();
    const listClientsUseCase = new ListClientsUseCase(clientRepository);
    clientController.registerEndpointGetClient(listClientsUseCase);

    clientController.registerEndpointGetClientById();
  }
}
