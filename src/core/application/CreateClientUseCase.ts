import { ClientEntity } from "@domain/entities/ClientEntity";
import { IClientRepository } from "./ports/IClientRepository";
import { Cpf } from "@domain/value-objects/Cpf";
import { Either, left, right } from "src/shared/either";
import { InvalidCpfError } from "@domain/errors";
import { SaveClientError } from "@adapters/Driven/errors";
import { Email } from "@domain/value-objects/Email";

type Input = {
  cpf: string;
  name: string;
  email: string;
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
    const emailOutput = Email.create(input.email);
    if (emailOutput.isLeft()) {
      return left(emailOutput.value);
    }
    const cpf = cpfOutput.value as Cpf;
    const email = emailOutput.value as Email;
    const name = input.name;
    const clientEntity = new ClientEntity(cpf, name, email);
    const saveEntityOutput = await this.repository.save(clientEntity);
    if (saveEntityOutput.isLeft()) {
      return left(saveEntityOutput.value);
    }
    return right(clientEntity);
  }
}
