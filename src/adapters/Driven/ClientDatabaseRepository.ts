import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either } from "src/shared/either";
import { ListClientError } from "src/error";
import { SaveClientError } from "./errors";

export default class ClientDatabaseRepository implements IClientRepository {
  async save(
    client: ClientEntity
  ): Promise<Either<SaveClientError, ClientEntity>> {
    throw new Error("Method not implemented.");
  }

  async list(): Promise<Either<ListClientError, ClientEntity[]>> {
    throw new Error("Method not implemented.");
  }

  async get(cpf: any): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }
}
