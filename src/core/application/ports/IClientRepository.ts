import { ClientEntity } from "@domain/entities/ClientEntity";

export interface IClientRepository {
  save(client: ClientEntity): Promise<void>;
  list(): Promise<ClientEntity[]>;
  get(cpf: string): Promise<ClientEntity>;
}
