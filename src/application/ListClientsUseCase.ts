import { IClientRepository } from "./ports/IClientRepository";

export class ListClientsUseCase {
  constructor(readonly repository: IClientRepository) {}
  async execute() {
    return this.repository.list();
  }
}
