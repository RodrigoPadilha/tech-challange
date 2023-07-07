import { ListClientsUseCase } from "@application/ListClientsUseCase";
import { CreateClientUseCase } from "@application/CreateClientUseCase";
import { GetClientByCpfUseCase } from "@application/GetClientByCpfUseCase";
import IHttpServer from "@application/ports/IHttpServer";
import {
  HttpResponse,
  badRequest,
  created,
  ok,
  serverError,
} from "src/core/util/http-helper";
import { MissingParamError } from "../../errors/MissingParamError";
import { validateProps } from "./validateProps";

export class ClientController {
  constructor(private readonly httpServer: IHttpServer) {}

  registerEndpointListAllClients(listClientsUseCase: ListClientsUseCase) {
    this.httpServer.register("get", "/client", async function () {
      try {
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
      } catch (error) {
        return serverError(error);
      }
    });
  }

  registerEndpointCreateClient(createClientUseCase: CreateClientUseCase) {
    this.httpServer.register(
      "post",
      "/client",
      async function (params: any, body: any): Promise<HttpResponse> {
        try {
          const missingProps = validateProps(["cpf", "name", "email"], body);
          if (missingProps.length > 0) {
            const missingParam = missingProps.join(" ");
            return badRequest({
              error: new MissingParamError(missingParam.trim()).message,
            });
          }

          const { cpf, name, email } = body;
          const response = await createClientUseCase.execute({
            cpf,
            name,
            email,
          });
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
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointGetClientByCpf(getClientByCpfUseCase: GetClientByCpfUseCase) {
    this.httpServer.register(
      "get",
      "/client/:cpf",
      async function (params: any, body: any, query: any) {
        try {
          const response = await getClientByCpfUseCase.execute({
            cpf: params.cpf,
          });
          if (response.isLeft()) {
            return badRequest({ error: response.value.message });
          }
          if (!response.value) {
            return ok({ message: "Usuário não encontrado." });
          }
          const clientDto = {
            key: response.value.getKey(),
            cpf: response.value.getCpf(),
            isAnonymous: response.value.getIsAnonymous(),
          };
          return ok(clientDto);
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}

/* 
  const id = params.cpf;
  console.log(params);
  console.log(query); 
*/
