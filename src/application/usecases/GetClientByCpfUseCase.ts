import { Cpf } from "@application/value-objects/Cpf";
import { IClientDao } from "@application/usecases/ports/IClientDao";
import { Either, left, right } from "src/shared/either";
import { InvalidCpfError } from "@application/errors";
import { ClientEntity } from "@application/entities/ClientEntity";
import { ClientNotFoundError, GetClientError } from "src/dao/errors";

type Input = {
  cpf: string;
};

export class GetClientByCpfUseCase {
  constructor(private readonly dao: IClientDao) {}

  async execute(
    input: Input
  ): Promise<
    Either<InvalidCpfError | GetClientError | ClientNotFoundError, ClientEntity>
  > {
    const cpfOutput = Cpf.create(input.cpf);
    if (cpfOutput.isLeft()) {
      return left(cpfOutput.value);
    }
    const clientOutput = await this.dao.getBy(cpfOutput.value as Cpf);
    if (clientOutput.isLeft()) {
      return left(clientOutput.value);
    }
    return right(clientOutput.value as ClientEntity);
  }
}
