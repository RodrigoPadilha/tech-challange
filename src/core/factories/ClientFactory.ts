import IHttpServer from "@application/ports/IHttpServer";
import { ClientController } from "../infra/api/controllers";
import { ClientMemoryRepository } from "@adapters/Driven/ClientMemoryRepository";
import { CreateClientUseCase } from "@application/CreateClientUseCase";
import { ListClientsUseCase } from "@application/ListClientsUseCase";
import { GetClientByCpfUseCase } from "@application/GetClientByCpfUseCase";
import ClientDatabaseRepository from "@adapters/Driven/ClientDatabaseRepository";
import { IConnectionDatabase } from "@application/ports/IConnectionDatabase";

export class ClientFactory {
  private readonly clientController: ClientController;
  // private readonly clientRepository: ClientMemoryRepository;
  private readonly clientRepository: ClientDatabaseRepository;

  constructor(
    private readonly httpServer: IHttpServer,
    private readonly connection: IConnectionDatabase
  ) {
    this.clientController = new ClientController(this.httpServer);
    // this.clientRepository = new ClientMemoryRepository();
    this.clientRepository = new ClientDatabaseRepository(this.connection);
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

  makeGetClientByCpf = () => {
    this.clientController.registerEndpointGetClientByCpf(
      new GetClientByCpfUseCase(this.clientRepository)
    );
  };
}
