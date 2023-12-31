import { ClientEntity } from "@application/entities/ClientEntity";
import { IClientDao } from "@application/usecases/ports/IClientDao";
import { Cpf } from "@application/value-objects/Cpf";
import { Either, left, right } from "src/shared/either";
import { InvalidCpfError } from "@application/errors";
import { SaveClientError } from "src/dao/errors";
import { Email } from "@application/value-objects/Email";

interface Input {
  cpf: string;
  name: string;
  email: string;
}

export class CreateClientUseCase {
  constructor(private readonly dao: IClientDao) {}
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
    const saveEntityOutput = await this.dao.save(clientEntity);
    if (saveEntityOutput.isLeft()) {
      return left(saveEntityOutput.value);
    }
    return right(saveEntityOutput.value);
  }
}
