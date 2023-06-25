import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";

export class ClientMemoryRepository implements IClientRepository {
  private clients: ClientEntity[];

  constructor() {
    this.clients = [];
  }

  async save(client: ClientEntity): Promise<void> {
    this.clients.push(client);
  }

  async list(): Promise<ClientEntity[]> {
    return this.clients;
  }

  async get(cpf: any): Promise<ClientEntity> {
    const client = this.clients.find((client) => client.cpf === cpf);
    return client;
  }
}
