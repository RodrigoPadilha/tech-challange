import { ListClientsUseCase } from "@application/ListClientsUseCase";
import { CreateClientUseCase } from "@application/CreateClientUseCase";
import IHttpServer from "@application/ports/IHttpServer";
import { created, ok } from "src/core/util/http-helper";

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
        return ok(clientsDto);
      }
    );
  }

  registerEndpointCreateClient(createClientUseCase: CreateClientUseCase) {
    this.httpServer.register(
      "post",
      "/client",
      async function (params: any, body: any) {
        try {
          await createClientUseCase.execute(body);
          return created({ message: "Cliente criado com sucesso!" });
        } catch (error) {
          console.log(error);
        }
      }
    );
  }

  registerEndpointGetClientById() {
    this.httpServer.register(
      "get",
      "/client/:id",
      async function (params: any, body: any) {
        const id = params.id;
        return ok({
          id: id,
          nome: "Any Client",
          cpf: "000000000" + id,
        });
      }
    );
  }
}
