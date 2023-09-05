import IHttpServer from "@adapters/ports/IHttpServer";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { ClientController } from "../controllers";
import { CreateClientUseCase } from "@application/usecases/CreateClientUseCase";
import { ListClientsUseCase } from "@application/usecases/ListClientsUseCase";
import { GetClientByCpfUseCase } from "@application/usecases/GetClientByCpfUseCase";
import ClientDao from "src/dao/ClientDao";

export class ClientFactory {
  private readonly clientController: ClientController;
  private readonly clientDao: ClientDao;

  constructor(
    private readonly httpServer: IHttpServer,
    private readonly connection: IConnectionDatabase
  ) {
    this.clientController = new ClientController(this.httpServer);
    this.clientDao = new ClientDao(this.connection);
  }

  makeCreateClientController = () => {
    this.clientController.registerEndpointCreateClient(
      new CreateClientUseCase(this.clientDao)
    );
  };

  makeListAllClientsController = () => {
    this.clientController.registerEndpointListAllClients(
      new ListClientsUseCase(this.clientDao)
    );
  };

  makeGetClientByCpf = () => {
    this.clientController.registerEndpointGetClientByCpf(
      new GetClientByCpfUseCase(this.clientDao)
    );
  };
}
