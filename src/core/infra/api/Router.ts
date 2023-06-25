import IHttpServer from "src/core/application/ports/IHttpServer";
import { ClientController } from "./controllers";
import { ClientMemoryRepository } from "@adapters/Driven/ClientMemoryRepository";
import { ListClientsUseCase } from "src/core/application/ListClientsUseCase";
import { CreateClientUseCase } from "src/core/application/CreateClientUseCase";

export default class Router {
  constructor(readonly httpServer: IHttpServer) {}

  start() {
    console.log("> [Router] starting...");

    const clientController = new ClientController(this.httpServer);
    const clientRepository = new ClientMemoryRepository();

    const listClientsUseCase = new ListClientsUseCase(clientRepository);
    clientController.registerEndpointGetClient(listClientsUseCase);

    const createClientUseCase = new CreateClientUseCase(clientRepository);
    clientController.registerEndpointCreateClient(createClientUseCase);

    //clientController.registerEndpointGetClientById();
  }
}
