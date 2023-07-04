import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either } from "src/shared/either";
import { CreateClientError, ListClientError } from "src/error";

export interface IClientRepository {
  save(client: ClientEntity): Promise<Either<CreateClientError, ClientEntity>>;
  list(): Promise<Either<ListClientError, ClientEntity[]>>;
  get(cpf: string): Promise<ClientEntity>;
}
