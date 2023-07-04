import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { CreateClientError, ListClientError } from "src/error";
import { Either } from "src/shared/either";

export default class ClientDatabaseRepository implements IClientRepository {
  async save(client: ClientEntity): Promise<Either<CreateClientError, ClientEntity>> {
    throw new Error("Method not implemented.");
  }

  async list(): Promise<Either<ListClientError,ClientEntity[]>> {
    throw new Error("Method not implemented.");
  }

  async get(cpf: any): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }
}
