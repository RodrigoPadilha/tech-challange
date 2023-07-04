import IHttpServer from "@application/ports/IHttpServer";
import { ClientController } from "../infra/api/controllers";
import { ClientMemoryRepository } from "@adapters/Driven/ClientMemoryRepository";
import { CreateClientUseCase } from "@application/CreateClientUseCase";
import { ListClientsUseCase } from "@application/ListClientsUseCase";

export class ClientFactory {
  private readonly clientController: ClientController;
  private readonly clientRepository: ClientMemoryRepository;

  constructor(private readonly httpServer: IHttpServer) {
    this.clientController = new ClientController(this.httpServer);
    this.clientRepository = new ClientMemoryRepository();
  }

  makeCreateClientController = () => {
    this.clientController.registerEndpointCreateClient(
      new CreateClientUseCase(this.clientRepository)
    );
  };

  makeListAllClientsController = () => {
    this.clientController.registerEndpointListAllClients(
      new ListClientsUseCase(this.clientRepository)
    );
  };
}
