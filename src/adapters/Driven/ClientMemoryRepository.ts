import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either, left, right } from "src/shared/either";
import {
  SaveClientError,
  ListClientError,
  GetClientError,
  ClientNotFoundError,
} from "./errors";
import { Cpf } from "@domain/value-objects/Cpf";

export class ClientMemoryRepository implements IClientRepository {
  private clients: ClientEntity[];

  constructor() {
    this.clients = [];
  }

  async save(
    newClient: ClientEntity
  ): Promise<Either<SaveClientError, ClientEntity>> {
    try {
      const foundClient = this.clients.find(
        (client) => client.getCpf() === newClient.getCpf()
      );
      if (!!foundClient) {
        return right(foundClient);
      }

      this.clients.push(newClient);
      return right(newClient);
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

  async getBy(
    cpf: Cpf
  ): Promise<Either<GetClientError | ClientNotFoundError, ClientEntity>> {
    try {
      console.log(cpf.getValue());
      console.log(cpf.getValue());
      console.log(cpf.getValue());
      const client = this.clients.find(
        (client) => client.getCpf() === cpf.getValue()
      );
      if (!client) {
        return left(new ClientNotFoundError(cpf.getValue()));
      }
      return right(client);
    } catch (error) {
      return left(new GetClientError(cpf.getValue()));
    }
  }
}
