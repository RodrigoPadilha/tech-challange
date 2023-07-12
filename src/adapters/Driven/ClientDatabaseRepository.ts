import { IClientRepository } from "@application/ports/IClientRepository";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { Either, left, right } from "src/shared/either";
import {
  ClientNotFoundError,
  GetClientError,
  ListClientError,
  SaveClientError,
} from "./errors";
import { Cpf } from "@domain/value-objects/Cpf";
import { IConnectionDatabase } from "@application/ports/IConnectionDatabase";
import {
  PrismaClient,
  PrismaConnection,
} from "@adapters/Driver/PrismaConnection";
import { Email } from "@domain/value-objects/Email";

export default class ClientDatabaseRepository implements IClientRepository {
  private connection: IConnectionDatabase;
  private prisma: PrismaClient;

  constructor(connection: IConnectionDatabase) {
    this.connection = connection;
    this.prisma = (connection as PrismaConnection).getConnection();
  }

  async save(
    newClient: ClientEntity
  ): Promise<Either<SaveClientError, ClientEntity>> {
    try {
      await this.connection.connect();
      const existingClient = await this.prisma.client.findFirst({
        where: { cpf: newClient.getCpf() },
      });
      if (existingClient) {
        const clientEntity = this.clientEntityFacotry(existingClient);
        return right(clientEntity);
      }
      await this.prisma.client.create({
        data: {
          key: newClient.getKey(),
          is_anonymous: newClient.getIsAnonymous(),
          cpf: newClient.getCpf(),
          name: newClient.getName(),
          email: newClient.getEmail(),
        },
      });
      return right(newClient);
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
      const clientsData = await this.prisma.client.findMany();
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
      const clientFound = await this.prisma.client.findFirst({
        where: { cpf: cpf.getValue() },
      });
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
