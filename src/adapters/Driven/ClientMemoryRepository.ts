import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either, left, right } from "src/shared/either";
import { SaveClientError, ListClientError } from "./errors";
import { Cpf } from "@domain/value-objects/Cpf";

export class ClientMemoryRepository implements IClientRepository {
  private clients: ClientEntity[];

  constructor() {
    this.clients = [];
  }

  async save(
    client: ClientEntity
  ): Promise<Either<SaveClientError, ClientEntity>> {
    try {
      this.clients.push(client);
      return right(client);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new SaveClientError(error));
    }
  }

  async list(): Promise<Either<ListClientError, ClientEntity[]>> {
    try {
      return right(this.clients);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new ListClientError(error));
    }
  }

  async getBy(cpf: Cpf): Promise<ClientEntity> {
    const client = this.clients.find(
      (client) => client.getCpf() === cpf.getValue()
    );
    return client;
  }
}
