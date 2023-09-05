import { ClientEntity } from "@application/entities/ClientEntity";
import { Either } from "src/shared/either";
import {
  ClientNotFoundError,
  GetClientError,
  ListClientError,
  SaveClientError,
} from "src/dao/errors";
import { Cpf } from "@application/value-objects/Cpf";

export interface IClientDao {
  save(newClient: ClientEntity): Promise<Either<SaveClientError, ClientEntity>>;
  list(): Promise<Either<ListClientError, ClientEntity[]>>;
  getBy(
    cpf: Cpf
  ): Promise<Either<GetClientError | ClientNotFoundError, ClientEntity>>;
}
