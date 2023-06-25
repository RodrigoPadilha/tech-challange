import { ListClientsUseCase } from "@application/ListClientsUseCase";
import IHttpServer from "@application/ports/IHttpServer";

export class ClientController {
  constructor(readonly httpServer: IHttpServer) {}

  registerEndpointGetClient(listClientsUseCase: ListClientsUseCase) {
    this.httpServer.register(
      "get",
      "/client",
      async function (params: any, body: any) {
        const clientsData = await listClientsUseCase.execute();
        const clientsDto = clientsData.map((clientData) => ({
          nome: clientData.name,
          cpf: clientData.cpf,
        }));
        return clientsDto;
      }
    );
  }

  registerEndpointGetClientById() {
    this.httpServer.register(
      "get",
      "/client/:id",
      async function (params: any, body: any) {
        const id = params.id;
        return {
          id: id,
          nome: "Any Client",
          cpf: "000000000" + id,
        };
      }
    );
  }
}
