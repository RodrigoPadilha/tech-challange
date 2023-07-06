import { ClientEntity } from "@domain/entities/ClientEntity";
import { IClientRepository } from "./ports/IClientRepository";
import { Cpf } from "@domain/value-objects/Cpf";
import { Either, left, right } from "src/shared/either";
import { InvalidCpfError } from "@domain/errors";
import { SaveClientError } from "@adapters/Driven/errors";

type Input = {
  cpf: string;
};

export class CreateClientUseCase {
  constructor(readonly repository: IClientRepository) {}
  async execute(
    input: Input
  ): Promise<Either<InvalidCpfError | SaveClientError, ClientEntity>> {
    const cpfOutput = Cpf.create(input.cpf);
    if (cpfOutput.isLeft()) {
      return left(cpfOutput.value);
    }
    const clientEntity = new ClientEntity(cpfOutput.value as Cpf);
    const saveEntityOutput = await this.repository.save(clientEntity);
    if (saveEntityOutput.isLeft()) {
      return left(saveEntityOutput.value);
    }
    return right(clientEntity);
  }
}
