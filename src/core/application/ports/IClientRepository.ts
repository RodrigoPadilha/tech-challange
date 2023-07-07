import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either } from "src/shared/either";
import { ListClientError, SaveClientError } from "@adapters/Driven/errors";
import { Cpf } from "@domain/value-objects/Cpf";

export interface IClientRepository {
  save(client: ClientEntity): Promise<Either<SaveClientError, ClientEntity>>;
  list(): Promise<Either<ListClientError, ClientEntity[]>>;
  getBy(cpf: Cpf): Promise<ClientEntity>;
}
