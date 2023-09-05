import { IClientDao } from "@application/usecases/ports/IClientDao";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { ClientEntity } from "@application/entities/ClientEntity";
import { Cpf } from "@application/value-objects/Cpf";
import { Email } from "@application/value-objects/Email";
import { Either, left, right } from "src/shared/either";
import {
  ClientNotFoundError,
  GetClientError,
  ListClientError,
  SaveClientError,
} from "./errors";

export default class ClientDao implements IClientDao {
  private connection: IConnectionDatabase;

  constructor(connection: IConnectionDatabase) {
    this.connection = connection;
  }

  async save(
    newClient: ClientEntity
  ): Promise<Either<SaveClientError, ClientEntity>> {
    try {
      await this.connection.connect();
      const client = await this.connection.saveClient(newClient);
      const clientEntity = this.clientEntityFacotry(client);
      return right(clientEntity);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new SaveClientError(error));
    } finally {
      await this.connection.disconnect();
    }
  }

  async list(): Promise<Either<ListClientError, ClientEntity[]>> {
    try {
      await this.connection.connect();
      const clientsData = await this.connection.listClients();
      const clientsEntities = clientsData.map((client) => {
        const clientEntity = this.clientEntityFacotry(client);
        return clientEntity;
      });
      return right(clientsEntities);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new ListClientError(error));
    } finally {
      await this.connection.disconnect();
    }
  }

  async getBy(
    cpf: Cpf
  ): Promise<Either<GetClientError | ClientNotFoundError, ClientEntity>> {
    try {
      await this.connection.connect();
      const clientFound = await this.connection.getClientByCpf(cpf.getValue());
      if (!clientFound) {
        return left(new ClientNotFoundError(cpf.getValue()));
      }
      const clientEntity = this.clientEntityFacotry(clientFound);
      return right(clientEntity);
    } catch (error) {
      console.log("===> ERRR", error);
      return left(new GetClientError(cpf.getValue()));
    } finally {
      await this.connection.disconnect();
    }
  }

  private clientEntityFacotry(dataEntity) {
    const cpfOutput = Cpf.create(dataEntity.cpf);
    const emailOutput = Email.create(dataEntity.email);
    const clientEntity = new ClientEntity(
      cpfOutput.value as Cpf,
      dataEntity.name,
      emailOutput.value as Email,
      dataEntity.key
    );
    return clientEntity;
  }
}
