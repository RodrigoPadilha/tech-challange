import { ClientEntity } from "src/core/domain/entities/ClientEntity";
import { IClientRepository } from "./ports/IClientRepository";

type Input = {
  nome: string;
  cpf: string;
};

export class CreateClientUseCase {
  constructor(readonly repository: IClientRepository) {}
  async execute(input: Input) {
    const clientEntity = new ClientEntity(input.nome, input.cpf);
    return this.repository.save(clientEntity);
  }
}
