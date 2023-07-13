import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either } from "src/shared/either";
import {
  ClientNotFoundError,
  GetClientError,
  ListClientError,
  SaveClientError,
} from "@adapters/Driven/errors";
import { Cpf } from "@domain/value-objects/Cpf";

export interface IClientRepository {
  save(newClient: ClientEntity): Promise<Either<SaveClientError, ClientEntity>>;
  list(): Promise<Either<ListClientError, ClientEntity[]>>;
  getBy(
    cpf: Cpf
  ): Promise<Either<GetClientError | ClientNotFoundError, ClientEntity>>;
}
