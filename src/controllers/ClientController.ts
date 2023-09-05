import { ListClientsUseCase } from "@application/usecases/ListClientsUseCase";
import { CreateClientUseCase } from "@application/usecases/CreateClientUseCase";
import { GetClientByCpfUseCase } from "@application/usecases/GetClientByCpfUseCase";
import IHttpServer from "@adapters/ports/IHttpServer";
import {
  HttpResponse,
  badRequest,
  created,
  ok,
  serverError,
} from "src/util/http-helper";
import { MissingParamError } from "src/infra/errors/MissingParamError";
import { validateProps } from "./validateProps";

export class ClientController {
  constructor(private readonly httpServer: IHttpServer) {}

  registerEndpointListAllClients(listClientsUseCase: ListClientsUseCase) {
    this.httpServer.register(
      "get",
      "/client",
      async function (params: any, body: any) {
        try {
          const result = await listClientsUseCase.execute();
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          const clientsDto = result.value.map((clientData) => ({
            cpf: clientData.getCpf(),
            key: clientData.getKey(),
            isAnonymous: clientData.getIsAnonymous(),
          }));
          return ok(clientsDto);
        } catch (error) {
          console.log("===> ERRRO: ", error);
          return serverError(error);
        }
      }
    );
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
          const result = await createClientUseCase.execute({
            cpf,
            name,
            email,
          });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          const clientDto = {
            key: result.value.getKey(),
            cpf: result.value.getCpf(),
            isAnonymous: result.value.getIsAnonymous(),
          };

          return created({
            message: "Cliente criado com sucesso!",
            client: clientDto,
          });
        } catch (error) {
          console.log("===> ERRRO: ", error);
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
          const result = await getClientByCpfUseCase.execute({
            cpf: params.cpf,
          });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          if (!result.value) {
            return ok({ message: "Usuário não encontrado." });
          }
          const clientDto = {
            key: result.value.getKey(),
            cpf: result.value.getCpf(),
            isAnonymous: result.value.getIsAnonymous(),
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
