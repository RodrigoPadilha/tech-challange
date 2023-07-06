import { ListClientsUseCase } from "@application/ListClientsUseCase";
import { CreateClientUseCase } from "@application/CreateClientUseCase";
import { GetClientByCpfUseCase } from "@application/GetClientByCpfUseCase";
import IHttpServer from "@application/ports/IHttpServer";
import {
  HttpResponse,
  badRequest,
  created,
  ok,
} from "src/core/util/http-helper";

export class ClientController {
  constructor(readonly httpServer: IHttpServer) {}

  registerEndpointListAllClients(listClientsUseCase: ListClientsUseCase) {
    this.httpServer.register("get", "/client", async function () {
      const response = await listClientsUseCase.execute();
      if (response.isLeft()) {
        return badRequest({ error: response.value.message });
      }
      const clientsDto = response.value.map((clientData) => ({
        cpf: clientData.getCpf(),
        key: clientData.getKey(),
        isAnonymous: clientData.getIsAnonymous(),
      }));
      return ok(clientsDto);
    });
  }

  registerEndpointCreateClient(createClientUseCase: CreateClientUseCase) {
    this.httpServer.register(
      "post",
      "/client",
      async function (params: any, body: any): Promise<HttpResponse> {
        const response = await createClientUseCase.execute(body);
        if (response.isLeft()) {
          return badRequest({ error: response.value.message });
        }
        const clientDto = {
          key: response.value.getKey(),
          cpf: response.value.getCpf(),
          isAnonymous: response.value.getIsAnonymous(),
        };
        return created({
          message: "Cliente criado com sucesso!",
          client: clientDto,
        });
      }
    );
  }

  registerEndpointGetClientByCpf(getClientByCpfUseCase: GetClientByCpfUseCase) {
    this.httpServer.register(
      "get",
      "/client/:id",
      async function (params: any, body: any, query: any) {
        const id = params.id;
        console.log(params);
        console.log(query);
        return ok({
          id: id,
          nome: "Any Client",
          cpf: "000000000" + id,
        });
      }
    );
  }
}
