import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";

export default class ClientDatabaseRepository implements IClientRepository {
  async save(client: ClientEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async list(): Promise<ClientEntity[]> {
    throw new Error("Method not implemented.");
  }

  async get(cpf: any): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }
}
