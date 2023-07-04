import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either, left, right } from "src/shared/either";
import { CreateClientError, ListClientError } from "src/error";

export class ClientMemoryRepository implements IClientRepository {
  private clients: ClientEntity[];

  constructor() {
    this.clients = [];
  }

  async save(
    client: ClientEntity
  ): Promise<Either<CreateClientError, ClientEntity>> {
    try {
      this.clients.push(client);
      return right(client);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new CreateClientError(error));
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

  async get(cpf: any): Promise<ClientEntity> {
    const client = this.clients.find((client) => client.cpf === cpf);
    return client;
  }
}
