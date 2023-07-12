import { Cpf } from "@domain/value-objects/Cpf";
import { IClientRepository } from "./ports/IClientRepository";
import { Either, left, right } from "src/shared/either";
import { InvalidCpfError } from "@domain/errors";
import { ClientEntity } from "@domain/entities/ClientEntity";
import { ClientNotFoundError, GetClientError } from "@adapters/Driven/errors";

type Input = {
  cpf: string;
};

export class GetClientByCpfUseCase {
  constructor(private readonly repository: IClientRepository) {}

  async execute(
    input: Input
  ): Promise<
    Either<InvalidCpfError | GetClientError | ClientNotFoundError, ClientEntity>
  > {
    const cpfOutput = Cpf.create(input.cpf);
    if (cpfOutput.isLeft()) {
      return left(cpfOutput.value);
    }
    const clientOutput = await this.repository.getBy(cpfOutput.value as Cpf);
    if (clientOutput.isLeft()) {
      return left(clientOutput.value);
    }
    return right(clientOutput.value as ClientEntity);
  }
}
