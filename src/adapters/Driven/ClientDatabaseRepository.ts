import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either } from "src/shared/either";
import { ListClientError, SaveClientError } from "./errors";
import { Cpf } from "@domain/value-objects/Cpf";

export default class ClientDatabaseRepository implements IClientRepository {
  async save(
    newClient: ClientEntity
  ): Promise<Either<SaveClientError, ClientEntity>> {
    throw new Error("Method not implemented.");
  }

  async list(): Promise<Either<ListClientError, ClientEntity[]>> {
    throw new Error("Method not implemented.");
  }

  async getBy(cpf: Cpf): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }

  async get(cpf: any): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }
}
